import assert from 'node:assert/strict'
import { signal, signalBreakdown, crosses, bestLink, defaults, preset } from './src/model.ts'
const a={x:0,y:0},b={x:10,y:0}
const s={...defaults,exponent:2}
assert.ok(Math.abs(signal(a,{x:1,y:0},[],s)+20.052)<.02,'1 m Friis reference')
assert.ok(Math.abs(signal(a,b,[],s)-signal(a,{x:1,y:0},[],s)+20)<1e-8,'10x distance adds 20 dB at n=2')
assert.ok(Math.abs(signal(a,b,[],{...s,frequency:5})-signal(a,b,[],s)+20*Math.log10(5/2.4))<1e-8,'frequency scaling')
assert.equal(signal(a,b,[],{...s,power:25})-signal(a,b,[],s),5)
const w={id:'test',a:{x:5,y:-1},b:{x:5,y:1},loss:7}
assert.equal(signal(a,b,[w],s)-signal(a,b,[],s),-7)
assert.equal(crosses(a,b,w.a,w.b),true)
assert.equal(crosses(a,b,{x:11,y:-1},{x:11,y:1}),false)
assert.equal(crosses(a,b,{x:0,y:1},{x:10,y:1}),false)
assert.equal(signal(a,a,[],s),signal(a,{x:1,y:0},[],s))
assert.equal(bestLink(a,preset('blank'),s),undefined)
assert.equal(bestLink({x:5,y:5},preset('open'),s).ap.id,'ap1')
const detail=signalBreakdown(a,b,[w,{...w,id:'second',a:{x:8,y:-1},b:{x:8,y:1},loss:3}],s)
assert.equal(detail.distance,10)
assert.equal(detail.distanceLoss,20)
assert.equal(detail.wallLoss,10)
assert.equal(detail.crossedWalls.length,2)
assert.ok(Math.abs(detail.dbm-(-50.052))<.02,'10 m, n=2, 10 dB walls: about -50.052 dBm')
assert.ok(Math.abs(detail.margin-16.948)<.02,'margin relative to -67 dBm')
const close=signalBreakdown(a,{x:.5,y:0},[],s)
assert.equal(close.distance,.5)
assert.equal(close.modeledDistance,1)
assert.equal(close.distanceLoss,0)
assert.equal(signalBreakdown(a,b,[{...w,a:{x:20,y:-1},b:{x:20,y:1}}],s).wallLoss,0)
console.log('21 signal-model checks passed')
