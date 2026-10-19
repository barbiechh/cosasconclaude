import bpy, gzip, struct, math, sys, numpy as np
S='/tmp/claude-0/-home-user-cosasconclaude/3eee7b34-51e9-5665-a4c6-4a33bafe69f4'
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
OUT=args[0]; F0=int(args[1]); F1=int(args[2]); SAMPLES=int(args[3]); RES=int(args[4])

b=gzip.decompress(open(f'{S}/brain/BrainMesh_ICBM152.lh.mz3','rb').read())
_,_,nf,nv,ns=struct.unpack('<HHIII',b[:16]); o=16+ns
faces=np.frombuffer(b,np.int32,nf*3,o).reshape(-1,3); o+=nf*12
verts=np.frombuffer(b,np.float32,nv*3,o).reshape(-1,3).astype(float)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc=bpy.context.scene
def mk(name,v,f):
    me=bpy.data.meshes.new(name); me.from_pydata(v.tolist(),[],f.tolist()); me.update()
    ob=bpy.data.objects.new(name,me); sc.collection.objects.link(ob)
    for p in me.polygons: p.use_smooth=True
    m=ob.modifiers.new('sub','SUBSURF'); m.levels=m.render_levels=1
    return ob
c=verts.mean(0)
L=(verts-c)*0.01; L[:,0]-= (L[:,0].max())+0.012  # medial wall near x=0
R=L.copy(); R[:,0]*=-1
lh=mk('lh',L,faces); rh=mk('rh',R,faces[:,::-1])
pivot=bpy.data.objects.new('pivot',None); sc.collection.objects.link(pivot)
lh.parent=rh.parent=pivot

src=bpy.data.objects.new('src',None); sc.collection.objects.link(src); src.location=(0,-0.05,-0.15)
# ---------- material ----------
mat=bpy.data.materials.new('brain'); mat.use_nodes=True
nt=mat.node_tree; N=nt.nodes; Ln=nt.links; N.clear()
def n(t,**kw):
    x=N.new(t)
    for k,v in kw.items(): setattr(x,k,v)
    return x
out=n('ShaderNodeOutputMaterial')
bsdf=n('ShaderNodeBsdfPrincipled')
geo=n('ShaderNodeNewGeometry')
# gyri/sulci coloring from pointiness
cr=n('ShaderNodeValToRGB'); Ln.new(geo.outputs['Pointiness'],cr.inputs[0])
cr.color_ramp.elements[0].position=0.47; cr.color_ramp.elements[0].color=(0.16,0.07,0.07,1)
cr.color_ramp.elements[1].position=0.56; cr.color_ramp.elements[1].color=(0.80,0.50,0.47,1)
# dopamine front: distance from src (object coords)
tc=n('ShaderNodeTexCoord'); tc.object=src
dist=n('ShaderNodeVectorMath',operation='LENGTH'); Ln.new(tc.outputs['Object'],dist.inputs[0])
noise=n('ShaderNodeTexNoise',noise_dimensions='4D'); noise.inputs['Scale'].default_value=3.0
Ln.new(tc.outputs['Object'],noise.inputs['Vector'])
nadd=n('ShaderNodeMath',operation='MULTIPLY_ADD'); Ln.new(noise.outputs['Fac'],nadd.inputs[0]); nadd.inputs[1].default_value=0.25
Ln.new(dist.outputs['Value'],nadd.inputs[2])
front=n('ShaderNodeMapRange'); Ln.new(nadd.outputs[0],front.inputs['Value'])
front.inputs['From Min'].default_value=0.0
# charged = 1 behind front
front.inputs['To Min'].default_value=1; front.inputs['To Max'].default_value=0
# streaming veins: voronoi distance-to-edge animated
vor=n('ShaderNodeTexVoronoi',voronoi_dimensions='4D',feature='DISTANCE_TO_EDGE'); vor.inputs['Scale'].default_value=5
warp=n('ShaderNodeVectorMath',operation='MULTIPLY_ADD'); Ln.new(noise.outputs['Color'],warp.inputs[0]); warp.inputs[1].default_value=(0.18,0.18,0.18); Ln.new(tc.outputs['Object'],warp.inputs[2]); Ln.new(warp.outputs[0],vor.inputs['Vector'])
vr=n('ShaderNodeMapRange'); Ln.new(vor.outputs['Distance'],vr.inputs['Value'])
vr.inputs['From Min'].default_value=0.0; vr.inputs['From Max'].default_value=0.03
vr.inputs['To Min'].default_value=1.0; vr.inputs['To Max'].default_value=0.0
# glow ring at the front edge
ring=n('ShaderNodeMath',operation='PINGPONG'); Ln.new(front.outputs[0],ring.inputs[0]); ring.inputs[1].default_value=0.5
veinmix=n('ShaderNodeMath',operation='MULTIPLY_ADD'); Ln.new(vr.outputs[0],veinmix.inputs[0]); veinmix.inputs[1].default_value=1.6
Ln.new(ring.outputs[0],veinmix.inputs[2])
glow=n('ShaderNodeMath',operation='MULTIPLY'); Ln.new(veinmix.outputs[0],glow.inputs[0]); Ln.new(front.outputs[0],glow.inputs[1])
base_glow=n('ShaderNodeMath',operation='MULTIPLY'); Ln.new(front.outputs[0],base_glow.inputs[0])
tot=n('ShaderNodeMath',operation='ADD'); Ln.new(glow.outputs[0],tot.inputs[0]); Ln.new(base_glow.outputs[0],tot.inputs[1])
strength=n('ShaderNodeMath',operation='MULTIPLY'); Ln.new(tot.outputs[0],strength.inputs[0])
# base color: dull gray -> warm living pink with charge
gray=n('ShaderNodeRGBToBW'); Ln.new(cr.outputs[0],gray.inputs[0])
mixc=n('ShaderNodeMix',data_type='RGBA'); Ln.new(front.outputs[0],mixc.inputs['Factor'])
Ln.new(gray.outputs[0],mixc.inputs['A']); Ln.new(cr.outputs[0],mixc.inputs['B'])
Ln.new(mixc.outputs['Result'],bsdf.inputs['Base Color'])
bsdf.inputs['Roughness'].default_value=0.38
bsdf.inputs['Subsurface Weight'].default_value=0.25
bsdf.inputs['Subsurface Radius'].default_value=(0.02,0.006,0.004)
bsdf.inputs['Specular IOR Level'].default_value=0.6
bsdf.inputs['Emission Color'].default_value=(1.0,0.38,0.02,1)
Ln.new(strength.outputs[0],bsdf.inputs['Emission Strength'])
Ln.new(bsdf.outputs[0],out.inputs[0])
lh.data.materials.append(mat); rh.data.materials.append(mat)

# ---------- animation ----------
FR=150; sc.frame_start=1; sc.frame_end=FR; sc.render.fps=30
def key(sock,pairs):
    for f,v in pairs:
        sock.default_value=v; sock.keyframe_insert('default_value',frame=f)
key(front.inputs['From Max'],[(1,0.22),(18,0.33),(108,1.3),(150,1.45)])
key(base_glow.inputs[1],[(1,0.0),(105,0.12),(120,0.3),(132,0.16),(150,0.2)])
key(strength.inputs[1],[(1,1.6),(105,1.8),(120,2.7),(150,2.0)])
key(noise.inputs['W'],[(1,0),(150,1.5)])
key(vor.inputs['W'],[(1,0),(150,2.5)])
for fc in mat.node_tree.animation_data.action.fcurves if hasattr(mat.node_tree.animation_data.action,'fcurves') else []:
    for k in fc.keyframe_points: k.interpolation='BEZIER'
pivot.rotation_euler=(0,0,math.radians(-28)); pivot.keyframe_insert('rotation_euler',frame=1)
pivot.rotation_euler=(0,0,math.radians(22)); pivot.keyframe_insert('rotation_euler',frame=150)
sc.frame_set(1)

# ---------- camera & lights ----------
cam=bpy.data.cameras.new('cam'); cam.lens=60
co=bpy.data.objects.new('cam',cam); sc.collection.objects.link(co); sc.camera=co
co.location=(-3.5,-1.1,1.25)
tr=co.constraints.new('TRACK_TO'); tr.target=pivot
def light(loc,e,col,size=2):
    l=bpy.data.lights.new('l','AREA'); l.energy=e; l.color=col; l.size=size
    o=bpy.data.objects.new('l',l); o.location=loc; sc.collection.objects.link(o)
    t=o.constraints.new('TRACK_TO'); t.target=pivot
light((-3,-1.5,3),300,(1,0.95,0.9))
light((3,2,1.5),250,(0.5,0.65,1.0))   # cool rim
light((0,-3,-1.5),60,(1,0.8,0.7))
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True
w.node_tree.nodes['Background'].inputs[0].default_value=(0,0,0,1)

r=sc.render; r.engine='CYCLES'; sc.cycles.device='CPU'
sc.cycles.samples=SAMPLES; sc.cycles.use_denoising=True; sc.cycles.max_bounces=4; sc.cycles.diffuse_bounces=2; sc.cycles.glossy_bounces=2; sc.cycles.transmission_bounces=2; sc.cycles.transparent_max_bounces=2; r.use_persistent_data=True; sc.cycles.adaptive_threshold=0.05
r.resolution_x=r.resolution_y=RES
r.image_settings.file_format='PNG'
sc.view_settings.view_transform='AgX'; sc.view_settings.look='AgX - Medium High Contrast'
for f in ([int(x) for x in args[5].split(",")] if len(args)>5 else range(F0,F1+1)):
    sc.frame_set(f); r.filepath=f'{OUT}/b_{f:03d}.png'
    bpy.ops.render.render(write_still=True)
