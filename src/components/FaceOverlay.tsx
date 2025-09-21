import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useVoiceInteraction } from '../hooks/useVoiceInteraction';

function Avatar({ visemeState, isSpeaking, autoAnimate }: { visemeState: any; isSpeaking: boolean; autoAnimate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/avatar_1758395498717.glb');
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  
  // Morph target tracking
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const morphTargets = useRef<Record<string, { mesh: THREE.Mesh; index: number }>>({});
  const resolvedNameCache = useRef<Record<string, string | null>>({});
  const availableNamesRef = useRef<string[]>([]);

  // Skeleton bone tracking
  const boneMap = useRef<Record<string, THREE.Bone>>({});
  const resolvedBoneCache = useRef<Record<string, string | null>>({});
  const availableBoneNamesRef = useRef<string[]>([]);
  const initialBoneQuats = useRef<Record<string, THREE.Quaternion>>({});
  const boneTargetQuats = useRef<Record<string, THREE.Quaternion>>({});
  
  // Interactive state
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: -0.8 });
  const lastTap = useRef(0);
  const dragStart = useRef({ x: 0, y: 0 });
  
  // Eye movement and blinking
  const blinkTimer = useRef(Math.random() * 2 + 2); // Random 2-4s initial delay
  const blinkActive = useRef(false);
  const blinkProgress = useRef(0);
  const blinkDuration = useRef(0.14); // seconds
  const saccadeTimer = useRef(0);
  const eyeTarget = useRef(new THREE.Vector2(0, 0));
  
  // Facial expression system
  const [currentExpression, setCurrentExpression] = useState<'neutral' | 'happy' | 'surprised' | 'thinking' | 'speaking'>('neutral');
  const expressionTimer = useRef(0);
  const eyebrowTimer = useRef(0);
  const mouthIdleTimer = useRef(0);
  
  // Enhanced mouth movement for more natural speech
  const speechIntensity = useRef(0);
  const lastVisemeTime = useRef(0);
  
  // Mouse tracking for subtle head movement (only when not dragging)
  const target = useRef(new THREE.Vector2(0, 0));
  const [reduced, setReduced] = useState(false);

  // Scan for morph targets on model load
  useEffect(() => {
    if (scene) {
      const meshes: THREE.Mesh[] = [];
      const targets: Record<string, { mesh: THREE.Mesh; index: number }> = {};
      
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.morphTargetDictionary) {
          meshes.push(child);
          
          // Map morph target names to indices
          Object.keys(child.morphTargetDictionary).forEach(name => {
            const index = child.morphTargetDictionary![name];
            targets[name] = { mesh: child, index };
          });
        }
        if ((child as any).isBone) {
          const bone = child as unknown as THREE.Bone;
          boneMap.current[bone.name] = bone;
          // Store initial quaternions for reset/reference
          initialBoneQuats.current[bone.uuid] = bone.quaternion.clone();
          boneTargetQuats.current[bone.uuid] = bone.quaternion.clone();
        }
      });
      
      meshRefs.current = meshes;
      morphTargets.current = targets;
      availableNamesRef.current = Object.keys(targets);
      availableBoneNamesRef.current = Object.keys(boneMap.current);
      
      // Debug: show what we found
      console.log('Found morph targets:', availableNamesRef.current);
      console.log('Found bones:', availableBoneNamesRef.current);

      // Prime resolver cache for common shapes we use
      const canonicalToPrime = [
        'browInnerUp','browOuterUpLeft','browOuterUpRight','browDownLeft','browDownRight',
        'eyeBlinkLeft','eyeBlinkRight','eyeWideLeft','eyeWideRight',
        'eyeLookInLeft','eyeLookOutLeft','eyeLookUpLeft','eyeLookDownLeft',
        'eyeLookInRight','eyeLookOutRight','eyeLookUpRight','eyeLookDownRight',
        'cheekPuff','cheekSquintLeft','cheekSquintRight',
        'jawOpen','mouthClose','mouthFunnel','mouthPucker','mouthLeft','mouthRight',
        'mouthSmileLeft','mouthSmileRight','mouthFrownLeft','mouthFrownRight',
        'mouthUpperUpLeft','mouthUpperUpRight','mouthShrugUpper','mouthStretchLeft','mouthStretchRight'
      ];
      canonicalToPrime.forEach(name => {
        // warm up cache
        resolveAvailableMorphName(name);
      });
    }
  }, [scene]);

  // Normalize name helper
  const normalizeName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Generate candidate aliases for a requested morph name
  const generateAliasCandidates = (name: string): string[] => {
    const candidates = new Set<string>();
    const base = name;
    const push = (n: string) => candidates.add(n);

    push(base);
    push(base.replace(/_L\b/i, 'Left').replace(/_R\b/i, 'Right'));
    push(base.replace(/_left/i, 'Left').replace(/_right/i, 'Right'));
    push(base.replace(/(^|_)eye_/i, 'eye'));
    push(base.replace(/_/g, ''));
    push(base.replace(/(^[a-z])/, (m) => m.toUpperCase())); // capitalize first

    // Specific known aliases between naming schemes
    const specific: Record<string, string[]> = {
      eye_blink_left: ['eyeBlinkLeft'],
      eye_blink_right: ['eyeBlinkRight'],
      eyeWide_L: ['eyeWideLeft'],
      eyeWide_R: ['eyeWideRight'],
      browOuterUp_L: ['browOuterUpLeft'],
      browOuterUp_R: ['browOuterUpRight'],
      browDown_L: ['browDownLeft'],
      browDown_R: ['browDownRight'],
      eyeSquint_L: ['eyeSquintLeft'],
      eyeSquint_R: ['eyeSquintRight'],
      mouthSmile_L: ['mouthSmileLeft'],
      mouthSmile_R: ['mouthSmileRight'],
      cheekSquint_L: ['cheekSquintLeft'],
      cheekSquint_R: ['cheekSquintRight'],
      jaw_open: ['jawOpen'],
      // Simplified eye look names -> ARKit pairs are handled elsewhere
      eye_look_left: ['eyeLookOutLeft','eyeLookInRight'],
      eye_look_right: ['eyeLookOutRight','eyeLookInLeft'],
      eye_look_up: ['eyeLookUpLeft','eyeLookUpRight'],
      eye_look_down: ['eyeLookDownLeft','eyeLookDownRight'],
    };
    const key = base as keyof typeof specific;
    if (specific[key]) specific[key].forEach(push);

    return Array.from(candidates);
  };

  // Resolve requested morph name to available target name in the loaded GLB
  const resolveAvailableMorphName = (requested: string): string | null => {
    if (resolvedNameCache.current[requested] !== undefined) {
      return resolvedNameCache.current[requested] as string | null;
    }
    const available = availableNamesRef.current;
    if (!available || available.length === 0) {
      resolvedNameCache.current[requested] = null;
      return null;
    }
    const normalizedAvailable = available.map(n => ({ raw: n, norm: normalizeName(n) }));
    const candidates = generateAliasCandidates(requested).map(n => ({ raw: n, norm: normalizeName(n) }));

    // Exact case-insensitive match first
    for (const c of candidates) {
      const found = available.find(a => a.toLowerCase() === c.raw.toLowerCase());
      if (found) {
        resolvedNameCache.current[requested] = found;
        return found;
      }
    }
    // Normalized match (ignore underscores/case)
    for (const c of candidates) {
      const found = normalizedAvailable.find(a => a.norm === c.norm);
      if (found) {
        resolvedNameCache.current[requested] = found.raw;
        return found.raw;
      }
    }
    // Starts-with/contains normalized for partials
    for (const c of candidates) {
      const found = normalizedAvailable.find(a => a.norm.includes(c.norm) || c.norm.includes(a.norm));
      if (found) {
        resolvedNameCache.current[requested] = found.raw;
        return found.raw;
      }
    }
    resolvedNameCache.current[requested] = null;
    return null;
  };

  // Bone aliasing
  const generateBoneAliasCandidates = (canonical: string): string[] => {
    const c = canonical.toLowerCase();
    const list: string[] = [];
    const push = (s: string) => list.push(s);

    // Common canonical to naming variants
    const map: Record<string, string[]> = {
      leftupperarm: ['LeftArm','LeftUpperArm','upperarm_l','upperarm.l','mixamorigLeftArm','Arm_L','Shoulder_L'],
      rightupperarm: ['RightArm','RightUpperArm','upperarm_r','upperarm.r','mixamorigRightArm','Arm_R','Shoulder_R'],
      leftlowerarm: ['LeftForeArm','LeftLowerArm','lowerarm_l','forearm_l','mixamorigLeftForeArm','ForeArm_L'],
      rightlowerarm: ['RightForeArm','RightLowerArm','lowerarm_r','forearm_r','mixamorigRightForeArm','ForeArm_R'],
      lefthand: ['LeftHand','hand_l','mixamorigLeftHand','Hand_L'],
      righthand: ['RightHand','hand_r','mixamorigRightHand','Hand_R'],
      leftupperleg: ['LeftUpLeg','LeftUpperLeg','upperleg_l','thigh_l','mixamorigLeftUpLeg','UpLeg_L'],
      rightupperleg: ['RightUpLeg','RightUpperLeg','upperleg_r','thigh_r','mixamorigRightUpLeg','UpLeg_R'],
      leftlowerleg: ['LeftLeg','LeftLowerLeg','lowerleg_l','calf_l','mixamorigLeftLeg','Leg_L'],
      rightlowerleg: ['RightLeg','RightLowerLeg','lowerleg_r','calf_r','mixamorigRightLeg','Leg_R'],
      hips: ['Hips','hips','pelvis','root'],
      spine: ['Spine','spine','spine_01','spine1'],
      chest: ['Spine2','spine_02','spine2','chest','upperchest'],
      neck: ['Neck','neck'],
      head: ['Head','head'],
      leftshoulder: ['LeftShoulder','shoulder_l','mixamorigLeftShoulder'],
      rightshoulder: ['RightShoulder','shoulder_r','mixamorigRightShoulder'],
    };
    const key = c.replace(/[^a-z]/g, '') as keyof typeof map;
    if (map[key]) map[key].forEach(push);
    // Also push normalized variations
    if (map[key]) {
      map[key].forEach(n => {
        push(n.toLowerCase());
        push(n.replace(/\./g, ''));
      });
    }
    return Array.from(new Set(list));
  };

  const resolveAvailableBoneName = (canonical: string): string | null => {
    if (resolvedBoneCache.current[canonical] !== undefined) {
      return resolvedBoneCache.current[canonical] as string | null;
    }
    const avail = availableBoneNamesRef.current;
    if (!avail || avail.length === 0) {
      resolvedBoneCache.current[canonical] = null;
      return null;
    }
    const cand = generateBoneAliasCandidates(canonical);
    // exact case-insensitive
    for (const c of cand) {
      const found = avail.find(a => a.toLowerCase() === c.toLowerCase());
      if (found) { resolvedBoneCache.current[canonical] = found; return found; }
    }
    // contains
    for (const c of cand) {
      const found = avail.find(a => a.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(a.toLowerCase()));
      if (found) { resolvedBoneCache.current[canonical] = found; return found; }
    }
    resolvedBoneCache.current[canonical] = null;
    return null;
  };

  const getBone = (canonical: string): THREE.Bone | null => {
    const resolved = resolveAvailableBoneName(canonical);
    return resolved ? boneMap.current[resolved] || null : null;
  };

  const setBoneTargetFromEuler = (bone: THREE.Bone | null, euler: THREE.Euler) => {
    if (!bone) return;
    const base = initialBoneQuats.current[bone.uuid];
    if (!base) return;
    const qRot = new THREE.Quaternion().setFromEuler(euler);
    const target = base.clone().multiply(qRot);
    boneTargetQuats.current[bone.uuid] = target;
  };

  const resetBoneTarget = (bone: THREE.Bone | null) => {
    if (!bone) return;
    const base = initialBoneQuats.current[bone.uuid];
    if (base) boneTargetQuats.current[bone.uuid] = base.clone();
  };

  const rad = (deg: number) => (deg * Math.PI) / 180;

  // Drive full-body pose for high-level expressions
  const setBodyPoseForExpression = (expr: string, t: number) => {
    const lUpperArm = getBone('leftUpperArm');
    const rUpperArm = getBone('rightUpperArm');
    const lLowerArm = getBone('leftLowerArm');
    const rLowerArm = getBone('rightLowerArm');
    const lHand = getBone('leftHand');
    const rHand = getBone('rightHand');
    const lUpperLeg = getBone('leftUpperLeg');
    const rUpperLeg = getBone('rightUpperLeg');
    const lLowerLeg = getBone('leftLowerLeg');
    const rLowerLeg = getBone('rightLowerLeg');
    const hips = getBone('hips');
    const spine = getBone('spine');
    const chest = getBone('chest');
    const neck = getBone('neck');
    const head = getBone('head');

    // Reset to base targets first
    [lUpperArm,rUpperArm,lLowerArm,rLowerArm,lHand,rHand,lUpperLeg,rUpperLeg,lLowerLeg,rLowerLeg,hips,spine,chest,neck,head].forEach(b => resetBoneTarget(b));

    const breathe = Math.sin(t * 1.2) * rad(2);
    setBoneTargetFromEuler(spine, new THREE.Euler(breathe, 0, 0));
    setBoneTargetFromEuler(chest, new THREE.Euler(-breathe * 0.6, 0, 0));

    switch (expr) {
      case 'thinking': {
        // Right hand to head, head tilt
        setBoneTargetFromEuler(rUpperArm, new THREE.Euler(rad(-25), 0, rad(20)));
        setBoneTargetFromEuler(rLowerArm, new THREE.Euler(rad(-65), 0, 0));
        setBoneTargetFromEuler(rHand, new THREE.Euler(rad(10), 0, 0));
        setBoneTargetFromEuler(head, new THREE.Euler(0, 0, rad(8)));
        // Left arm relaxed forward slightly
        setBoneTargetFromEuler(lUpperArm, new THREE.Euler(rad(-8), 0, rad(-10)));
        setBoneTargetFromEuler(lLowerArm, new THREE.Euler(rad(-10), 0, 0));
        break;
      }
      case 'happy': {
        // Both arms folded across chest (approximate)
        setBoneTargetFromEuler(lUpperArm, new THREE.Euler(rad(-25), 0, rad(-35)));
        setBoneTargetFromEuler(rUpperArm, new THREE.Euler(rad(-25), 0, rad(35)));
        setBoneTargetFromEuler(lLowerArm, new THREE.Euler(rad(-45), 0, rad(-5)));
        setBoneTargetFromEuler(rLowerArm, new THREE.Euler(rad(-45), 0, rad(5)));
        setBoneTargetFromEuler(lHand, new THREE.Euler(rad(10), 0, 0));
        setBoneTargetFromEuler(rHand, new THREE.Euler(rad(10), 0, 0));
        break;
      }
      case 'excited': {
        // Raise hands up and small jumping motion
        setBoneTargetFromEuler(lUpperArm, new THREE.Euler(rad(-80), 0, rad(-10)));
        setBoneTargetFromEuler(rUpperArm, new THREE.Euler(rad(-80), 0, rad(10)));
        setBoneTargetFromEuler(lLowerArm, new THREE.Euler(rad(-10), 0, 0));
        setBoneTargetFromEuler(rLowerArm, new THREE.Euler(rad(-10), 0, 0));
        // Legs bend during bounce
        const crouch = (Math.sin(t * 6) > 0) ? rad(12) : rad(4);
        setBoneTargetFromEuler(lUpperLeg, new THREE.Euler(crouch, 0, 0));
        setBoneTargetFromEuler(rUpperLeg, new THREE.Euler(crouch, 0, 0));
        setBoneTargetFromEuler(lLowerLeg, new THREE.Euler(-crouch * 0.8, 0, 0));
        setBoneTargetFromEuler(rLowerLeg, new THREE.Euler(-crouch * 0.8, 0, 0));
        // Head slightly up
        setBoneTargetFromEuler(head, new THREE.Euler(rad(-6), 0, 0));
        break;
      }
      default: {
        // Speaking gestures: subtle right hand gesture
        if (isSpeaking) {
          const wave = Math.sin(t * 5) * rad(8);
          setBoneTargetFromEuler(rUpperArm, new THREE.Euler(rad(-15), wave * 0.2, rad(10)));
          setBoneTargetFromEuler(rLowerArm, new THREE.Euler(rad(-30) + wave, 0, 0));
        }
      }
    }
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging) {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        target.current.set(x, y);
        
        // Eye tracking follows mouse with some smoothing
        eyeTarget.current.lerp(new THREE.Vector2(x * 0.3, y * 0.2), 0.1);
      }
    };
    
    const onMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
    };
    
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = (e.clientX - dragStart.current.x) * 0.003;
        const deltaY = -(e.clientY - dragStart.current.y) * 0.003;
        setPosition(prev => ({
          x: Math.max(-2, Math.min(2, prev.x + deltaX)),
          y: Math.max(-2, Math.min(1, prev.y + deltaY))
        }));
        dragStart.current = { x: e.clientX, y: e.clientY };
      }
    };
    
    const onMouseUp = () => {
      setIsDragging(false);
    };
    
    const onDoubleClick = () => {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        setScale(prev => prev >= 1.5 ? 1 : prev + 0.25);
      }
      lastTap.current = now;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('dblclick', onDoubleClick);
    
    // Touch events for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        const touch = e.touches[0];
        dragStart.current = { x: touch.clientX, y: touch.clientY };
      }
    };
    
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = (touch.clientX - dragStart.current.x) * 0.003;
        const deltaY = -(touch.clientY - dragStart.current.y) * 0.003;
        setPosition(prev => ({
          x: Math.max(-2, Math.min(2, prev.x + deltaX)),
          y: Math.max(-2, Math.min(1, prev.y + deltaY))
        }));
        dragStart.current = { x: touch.clientX, y: touch.clientY };
      }
    };
    
    const onTouchEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    
    // Prefers-reduced-motion
    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(!!mql?.matches);
    onChange();
    mql?.addEventListener?.('change', onChange);
    
    if (mql && 'addListener' in mql) {
      // @ts-ignore - deprecated API for older Safari
      mql.addListener(onChange);
    }

    return () => {
      window.removeEventListener('mousemove', onMove as any);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('dblclick', onDoubleClick);
      window.removeEventListener('touchstart', onTouchStart as any);
      window.removeEventListener('touchmove', onTouchMove as any);
      window.removeEventListener('touchend', onTouchEnd);
      mql?.removeEventListener?.('change', onChange);
      if (mql && 'removeListener' in mql) {
        // @ts-ignore - deprecated API for older Safari
        mql.removeListener(onChange);
      }
    };
  }, [isDragging]);

  useEffect(() => {
    // Setup animation mixer if animations exist
    if (animations.length > 0 && scene) {
      mixer.current = new THREE.AnimationMixer(scene);
      
      const idleAnim = animations.find(anim => 
        anim.name.toLowerCase().includes('idle') || 
        anim.name.toLowerCase().includes('breath') ||
        anim.name.toLowerCase().includes('default')
      ) || animations[0];
      
      if (idleAnim) {
        const action = mixer.current.clipAction(idleAnim);
        action.play();
      }
    }

    return () => {
      if (mixer.current) {
        mixer.current.stopAllAction();
        mixer.current = null;
      }
    };
  }, [animations, scene]);

  // Helper function to apply morph target influence
  const applyMorphTarget = (name: string, influence: number) => {
    // Special-case compound targets
    if (name === 'teeth_show') {
      // Try upper teeth exposure via upper lip raise
      const half = Math.max(0, Math.min(1, influence)) * 0.6;
      ['mouthUpperUpLeft','mouthUpperUpRight','mouthShrugUpper'].forEach(alias => {
        const resolved = resolveAvailableMorphName(alias);
        if (resolved) {
          const target = morphTargets.current[resolved];
          if (target?.mesh.morphTargetInfluences) {
            target.mesh.morphTargetInfluences[target.index] = half;
          }
        }
      });
      return;
    }

    const resolved = resolveAvailableMorphName(name) ?? name;
    const target = morphTargets.current[resolved];
    if (target && target.mesh.morphTargetInfluences) {
      target.mesh.morphTargetInfluences[target.index] = Math.max(0, Math.min(1, influence));
    }
  };

  // Map generic viseme labels to ARKit-style morph targets
  const applyViseme = (visemeType: string, intensity: number) => {
    const t = visemeType.toLowerCase();
    // If there's a direct morph name match, try it first
    const resolved = resolveAvailableMorphName(visemeType);
    if (resolved) {
      applyMorphTarget(resolved, intensity);
      return;
    }

    // Heuristic mapping
    if (/(o|uw|oo|ou)/.test(t)) {
      applyMorphTarget('mouthPucker', intensity * 0.9);
      applyMorphTarget('mouthFunnel', intensity * 0.6);
      return;
    }
    if (/(ee|iy|i)/.test(t)) {
      applyMorphTarget('mouthStretchLeft', intensity * 0.5);
      applyMorphTarget('mouthStretchRight', intensity * 0.5);
      return;
    }
    if (/(f|v)/.test(t)) {
      // Show teeth slightly by raising upper lip
      applyMorphTarget('mouthUpperUpLeft', intensity * 0.4);
      applyMorphTarget('mouthUpperUpRight', intensity * 0.4);
      return;
    }
    if (/(m|b|p)/.test(t)) {
      applyMorphTarget('mouthClose', intensity * 0.8);
      return;
    }
    // Default open vowel (ah/aa/eh)
    applyMorphTarget('jawOpen', intensity * 0.8);
  };

  // Reset all morph targets to 0
  const resetMorphTargets = () => {
    Object.values(morphTargets.current).forEach(({ mesh, index }) => {
      if (mesh.morphTargetInfluences) {
        mesh.morphTargetInfluences[index] = 0;
      }
    });
  };

  // Enhanced expression system
  const applyFacialExpression = (expression: string, intensity: number = 1.0) => {
    switch (expression) {
      case 'happy':
  applyMorphTarget('mouthSmileLeft', intensity * 0.7);
  applyMorphTarget('mouthSmileRight', intensity * 0.7);
  applyMorphTarget('cheekSquintLeft', intensity * 0.4);
  applyMorphTarget('cheekSquintRight', intensity * 0.4);
        applyMorphTarget('browInnerUp', intensity * 0.3);
        break;
      case 'surprised':
        applyMorphTarget('mouthFunnel', intensity * 0.6);
        applyMorphTarget('browInnerUp', intensity * 0.8);
  applyMorphTarget('browOuterUpLeft', intensity * 0.7);
  applyMorphTarget('browOuterUpRight', intensity * 0.7);
  applyMorphTarget('eyeWideLeft', intensity * 0.5);
  applyMorphTarget('eyeWideRight', intensity * 0.5);
        break;
      case 'thinking':
  applyMorphTarget('browDownLeft', intensity * 0.4);
  applyMorphTarget('browDownRight', intensity * 0.2);
        applyMorphTarget('mouthLeft', intensity * 0.3);
  applyMorphTarget('eyeSquintLeft', intensity * 0.2);
        break;
      case 'speaking':
        applyMorphTarget('browInnerUp', intensity * 0.2);
        applyMorphTarget('cheekPuff', intensity * 0.1);
        break;
    }
  };

  useFrame((_, delta) => {
    // Update animation mixer
    if (mixer.current && !reduced) {
      mixer.current.update(delta);
    }

    // Apply interactive position and scale
    if (group.current) {
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, position.x, 0.1);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, position.y, 0.1);
      group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, scale, 0.1));
      
      // Subtle head tracking (only when not dragging)
      if (!isDragging) {
        const intensity = reduced ? 0.02 : 0.05;
        const targetRotationY = target.current.x * intensity;
        const targetRotationX = -target.current.y * intensity * 0.5;
        
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.05);
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.05);
      }
    }

  // Reset all morph targets first
    resetMorphTargets();

    // Enhanced lip-sync with better mouth dynamics
    if (isSpeaking && visemeState.intensity > 0) {
      const now = performance.now();
      
      // Apply primary viseme (with ARKit fallback mapping)
      applyViseme(visemeState.type, visemeState.intensity);
      
      // Enhanced mouth movement with speech rhythm
      speechIntensity.current = THREE.MathUtils.lerp(speechIntensity.current, visemeState.intensity, 0.3);
      
      // Add subtle jaw movement and mouth shape variation
      const jawIntensity = speechIntensity.current * 0.6;
  applyMorphTarget('jawOpen', jawIntensity);
      applyMorphTarget('mouthClose', (1 - speechIntensity.current) * 0.3);
      
      // Add teeth visibility during speech
  applyMorphTarget('teeth_show', speechIntensity.current * 0.4);
      
  // Subtle cheek movement during speech
      applyMorphTarget('cheekPuff', Math.sin(now * 0.01) * speechIntensity.current * 0.1);
  // Stronger brow activity while speaking
  applyMorphTarget('browInnerUp', speechIntensity.current * 0.25);
      
      // Apply speaking expression
      applyFacialExpression('speaking', speechIntensity.current * 0.5);
      
      lastVisemeTime.current = now;
      setCurrentExpression('speaking');
    } else {
      // Decay speech intensity when not speaking
      speechIntensity.current = THREE.MathUtils.lerp(speechIntensity.current, 0, 0.1);
      
      // Return to neutral expression after speaking
      if (currentExpression === 'speaking' && speechIntensity.current < 0.1) {
        setCurrentExpression('neutral');
      }
    }

    // Idle mouth movements when not speaking or when auto-animating
    if (!isSpeaking || autoAnimate) {
      mouthIdleTimer.current += delta;
      const idleBase = autoAnimate ? 0.12 : 0.05;
      const idleIntensity = Math.max(0, Math.sin(mouthIdleTimer.current * 0.6) * idleBase);
      applyMorphTarget('mouthClose', Math.max(0, idleIntensity));
      // Subtle jaw bob for breathing
      applyMorphTarget('jawOpen', Math.max(0, Math.sin(mouthIdleTimer.current * 0.8) * (idleBase * 0.6)));
    }

    // Natural blinking system with time-based progress
    blinkTimer.current -= delta;
    if (!blinkActive.current && blinkTimer.current <= 0) {
      blinkActive.current = true;
      blinkProgress.current = 0;
      blinkDuration.current = 0.12 + Math.random() * 0.08; // 120-200ms
      // Next blink after current completes
      blinkTimer.current = Math.random() * 3 + 1.5;
    }
    if (blinkActive.current) {
      blinkProgress.current += delta / blinkDuration.current;
      const p = THREE.MathUtils.clamp(blinkProgress.current, 0, 1);
      // Ease-in-out for blink
      const amt = Math.sin(p * Math.PI);
      const left = 0.85 * amt;
      const right = 0.85 * amt * (0.9 + Math.random() * 0.2);
      applyMorphTarget('eyeBlinkLeft', left);
      applyMorphTarget('eyeBlinkRight', right);
      // Slight brow dip during blink
      applyMorphTarget('browDownLeft', amt * 0.12);
      applyMorphTarget('browDownRight', amt * 0.12);
      if (p >= 1) {
        blinkActive.current = false;
      }
    }

  // Enhanced eyebrow movements for expressiveness
    eyebrowTimer.current += delta;
    if (!isSpeaking || autoAnimate) {
      // Subtle eyebrow micro-movements
      const browBase = autoAnimate ? 0.12 : 0.08;
      const browIntensity = Math.sin(eyebrowTimer.current * 0.3) * browBase;
      applyMorphTarget('browInnerUp', Math.max(0, browIntensity));
      
      // Occasional eyebrow raise
      if (Math.sin(eyebrowTimer.current * 0.1) > 0.95) {
        applyMorphTarget('browOuterUpLeft', browBase * 1.6);
        applyMorphTarget('browOuterUpRight', browBase * 1.2);
      }
    }

  // Dynamic expression changes
    expressionTimer.current += delta;
    const canCycle = autoAnimate || (!isSpeaking);
    if (canCycle && expressionTimer.current > (autoAnimate ? 4.5 : 8)) { // faster cycles with autoAnimate
      const expressions = ['neutral', 'happy', 'thinking', 'surprised'];
      const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
      setCurrentExpression(randomExpression as any);
      expressionTimer.current = 0;
    }

  // Apply current facial expression
    if (!isSpeaking || autoAnimate) {
      const wobble = autoAnimate ? 0.45 : 0.3;
      const expressionIntensity = Math.sin(expressionTimer.current * 0.5) * wobble + 0.7;
      applyFacialExpression(currentExpression, expressionIntensity);
    }

    // Drive full-body poses to match expression/state
    const timeSec = performance.now() * 0.001;
    const bodyExpr = currentExpression === 'surprised' ? 'excited' : currentExpression;
    setBodyPoseForExpression(bodyExpr, timeSec);

    // Add small vertical bounce when excited
    if (group.current) {
      const baseY = position.y;
      const bounce = bodyExpr === 'excited' ? Math.max(0, Math.sin(timeSec * 6)) * 0.08 : 0;
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, baseY + bounce, 0.18);
    }

    // Smoothly slerp bones to their targets
    const boneLerp = THREE.MathUtils.clamp(delta * 6, 0, 1);
    Object.values(boneMap.current).forEach(b => {
      const targetQ = boneTargetQuats.current[b.uuid];
      if (targetQ) {
        b.quaternion.slerp(targetQ, boneLerp);
      }
    });

    // Enhanced eye movement and saccades
    if (!isDragging) {
      // Apply ARKit-style paired eye look morph targets
      const eyeLookIntensity = 0.8;
      if (autoAnimate && !isSpeaking) {
        // Drift eyes in a gentle Lissajous pattern when auto-animating
        const t = performance.now() * 0.0015;
        eyeTarget.current.x = Math.sin(t * 0.9) * 0.35;
        eyeTarget.current.y = Math.sin(t * 1.3 + Math.PI / 3) * 0.22;
      }
      const x = THREE.MathUtils.clamp(eyeTarget.current.x, -0.6, 0.6) * eyeLookIntensity;
      const y = THREE.MathUtils.clamp(eyeTarget.current.y, -0.4, 0.4) * eyeLookIntensity;

      if (x >= 0) {
        // Looking right: right eye looks out, left eye looks in
        applyMorphTarget('eyeLookOutRight', x);
        applyMorphTarget('eyeLookInLeft', x);
      } else {
        const lx = -x;
        applyMorphTarget('eyeLookOutLeft', lx);
        applyMorphTarget('eyeLookInRight', lx);
      }
      if (y >= 0) {
        // Looking up
        applyMorphTarget('eyeLookUpLeft', y);
        applyMorphTarget('eyeLookUpRight', y);
      } else {
        const ly = -y;
        applyMorphTarget('eyeLookDownLeft', ly);
        applyMorphTarget('eyeLookDownRight', ly);
      }
      
      // Enhanced saccades during speech with eyebrow coordination
      if (isSpeaking) {
        saccadeTimer.current -= delta;
        if (saccadeTimer.current <= 0) {
          // Brief random eye movement with eyebrow emphasis
          const randomX = (Math.random() - 0.5) * 0.4;
          const randomY = (Math.random() - 0.5) * 0.2;
          
          eyeTarget.current.x += randomX;
          eyeTarget.current.y += randomY;
          eyeTarget.current.x = Math.max(-0.6, Math.min(0.6, eyeTarget.current.x));
          eyeTarget.current.y = Math.max(-0.4, Math.min(0.4, eyeTarget.current.y));
          
          // Coordinated eyebrow movement with saccades
          if (Math.abs(randomY) > 0.1) {
            applyMorphTarget('browInnerUp', Math.abs(randomY) * 0.5);
          }
          
          saccadeTimer.current = Math.random() * 1.2 + 0.3; // 0.3-1.5s
        }
      } else {
        // Slower eye drift when not speaking
        const driftSpeed = 0.1;
        eyeTarget.current.x = THREE.MathUtils.lerp(eyeTarget.current.x, 0, driftSpeed);
        eyeTarget.current.y = THREE.MathUtils.lerp(eyeTarget.current.y, 0, driftSpeed);
      }
    }
  });

  return (
    <group ref={group}>
      <primitive 
        object={scene} 
        scale={[1, 1, 1]} 
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

export default function FaceOverlay({ onClose }: { onClose: () => void }) {
  const {
    isListening,
    isSpeaking,
    transcript,
    currentAnswer,
    visemeState,
    startListening,
    stopSpeaking,
    speakAnswer
  } = useVoiceInteraction();
  const [autoAnimate, setAutoAnimate] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 z-[70] pointer-events-none">
      {/* Top right close */}
      <button 
        onClick={onClose} 
        aria-label="Close" 
        className="pointer-events-auto absolute top-4 right-4 rounded-full w-10 h-10 bg-black/60 border border-white/15 grid place-items-center hover:bg-black/70 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/90" fill="currentColor">
          <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.7 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29 10.59 10.6l6.3-6.3Z"/>
        </svg>
      </button>
      
      {/* Voice Control Panel */}
      <div className="pointer-events-auto absolute top-4 left-4 bg-black/60 border border-white/15 rounded-lg p-4 text-white/80 text-sm max-w-80">
        <div className="font-medium mb-2 flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
          Voice Assistant
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={autoAnimate}
                onChange={(e) => setAutoAnimate(e.target.checked)}
                className="accent-blue-400"
              />
              Auto animate
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={startListening}
              disabled={isListening || isSpeaking}
              className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                isListening 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isListening ? 'Listening...' : 'Ask Question'}
            </button>
            
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="px-3 py-2 rounded text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                Stop Speaking
              </button>
            )}
          </div>
          
          {transcript && (
            <div className="text-xs">
              <div className="text-white/60 mb-1">You asked:</div>
              <div className="bg-white/10 rounded p-2 text-white/90">"{transcript}"</div>
            </div>
          )}
          
          {currentAnswer && (
            <div className="text-xs">
              <div className="text-white/60 mb-1">Assistant response:</div>
              <div className="bg-white/10 rounded p-2 text-white/90 max-h-20 overflow-y-auto">
                {currentAnswer}
              </div>
            </div>
          )}
          
          <div className="text-xs text-white/50 border-t border-white/10 pt-2">
            • Click "Ask Question" and speak
            • Drag avatar to move around
            • Double-click to scale up
            <br />
            <span className="text-yellow-300/70">
              ⚠️ Requires HTTPS and Chrome/Edge
            </span>
          </div>
        </div>
      </div>
      
      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="pointer-events-none absolute bottom-4 left-4 bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-2 text-green-300 text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Speaking...
        </div>
      )}
      
      {/* Transparent canvas overlay - larger size for full avatar */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[480px] h-[640px] pointer-events-auto cursor-grab active:cursor-grabbing">
          <Canvas
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
            camera={{ position: [0, 0, 4], fov: 45 }}
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[2, 2, 5]} intensity={0.8} />
            <directionalLight position={[-2, -1, 3]} intensity={0.3} />
            <Avatar visemeState={visemeState} isSpeaking={isSpeaking} autoAnimate={autoAnimate} />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
