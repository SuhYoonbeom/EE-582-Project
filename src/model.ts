export type Point = { x: number; y: number }
export type Device = Point & { id: string; kind: 'ap' | 'client'; name: string }
export type Wall = { id: string; a: Point; b: Point; loss: number }
export type Plan = { width: number; height: number; devices: Device[]; walls: Wall[] }
export type Settings = { frequency: number; power: number; exponent: number; threshold: number }
export const defaults: Settings = { frequency: 2.4, power: 20, exponent: 2.6, threshold: -67 }
export function crosses(a: Point, b: Point, c: Point, d: Point): boolean {
  const rx = b.x-a.x, ry = b.y-a.y, sx = d.x-c.x, sy = d.y-c.y
  const den = rx*sy-ry*sx
  if (Math.abs(den) < 1e-9) return false
  const t = ((c.x-a.x)*sy-(c.y-a.y)*sx)/den, u = ((c.x-a.x)*ry-(c.y-a.y)*rx)/den
  return t > 1e-7 && t < 1-1e-7 && u >= 0 && u <= 1
}
export function signal(ap: Point, client: Point, walls: Wall[], settings: Settings): number {
  const referenceLoss = 20*Math.log10(4*Math.PI*settings.frequency*1e9/299792458)
  const distance = Math.max(1, Math.hypot(client.x-ap.x,client.y-ap.y))
  const loss = walls.reduce((sum,w)=>sum+(crosses(ap,client,w.a,w.b)?w.loss:0),0)
  return settings.power-referenceLoss-10*settings.exponent*Math.log10(distance)-loss
}
export function bestLink(point: Point, plan: Plan, settings: Settings) {
  return plan.devices.filter(d=>d.kind==='ap').map(ap=>({ ap, dbm: signal(ap,point,plan.walls,settings) })).sort((a,b)=>b.dbm-a.dbm)[0]
}
export function preset(name: string): Plan {
  const devices: Device[] = [{id:'ap1',kind:'ap',name:'AP 1',x:5,y:5},{id:'ap2',kind:'ap',name:'AP 2',x:24,y:14},
    ...[[3,3],[12,4],[25,4],[6,15],[16,15],[27,17]].map(([x,y],i)=>({id:'c'+i,kind:'client' as const,name:'Client '+(i+1),x,y}))]
  const walls: Wall[] = name==='office' ? [
    {id:'w1',a:{x:10,y:0},b:{x:10,y:8},loss:5},{id:'w2',a:{x:10,y:10},b:{x:10,y:20},loss:5},
    {id:'w3',a:{x:20,y:0},b:{x:20,y:8},loss:5},{id:'w4',a:{x:20,y:10},b:{x:20,y:20},loss:5},
    {id:'w5',a:{x:0,y:10},b:{x:8,y:10},loss:5},{id:'w6',a:{x:22,y:10},b:{x:30,y:10},loss:5}] : []
  return {width:30,height:20,devices:name==='blank'?[]:devices,walls}
}
