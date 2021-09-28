import { Injectable } from '@angular/core';
/** Default values provider for tooltip */
export class TooltipConfig {
    constructor() {
        /** tooltip placement, supported positions: 'top', 'bottom', 'left', 'right' */
        this.placement = 'top';
        /** array of event names which triggers tooltip opening */
        this.triggers = 'hover focus';
    }
}
TooltipConfig.decorators = [
    { type: Injectable }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ib290c3RyYXAtbWQvc3JjL2xpYi9mcmVlL3Rvb2x0aXAvdG9vbHRpcC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsMENBQTBDO0FBRTFDLE1BQU0sT0FBTyxhQUFhO0lBRDFCO1FBRUUsK0VBQStFO1FBQ3hFLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDekIsMERBQTBEO1FBQ25ELGFBQVEsR0FBRyxhQUFhLENBQUM7SUFHbEMsQ0FBQzs7O1lBUkEsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqIERlZmF1bHQgdmFsdWVzIHByb3ZpZGVyIGZvciB0b29sdGlwICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVG9vbHRpcENvbmZpZyB7XG4gIC8qKiB0b29sdGlwIHBsYWNlbWVudCwgc3VwcG9ydGVkIHBvc2l0aW9uczogJ3RvcCcsICdib3R0b20nLCAnbGVmdCcsICdyaWdodCcgKi9cbiAgcHVibGljIHBsYWNlbWVudCA9ICd0b3AnO1xuICAvKiogYXJyYXkgb2YgZXZlbnQgbmFtZXMgd2hpY2ggdHJpZ2dlcnMgdG9vbHRpcCBvcGVuaW5nICovXG4gIHB1YmxpYyB0cmlnZ2VycyA9ICdob3ZlciBmb2N1cyc7XG4gIC8qKiBhIHNlbGVjdG9yIHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgdGhlIHRvb2x0aXAgc2hvdWxkIGJlIGFwcGVuZGVkIHRvLiBDdXJyZW50bHkgb25seSBzdXBwb3J0cyBcImJvZHlcIiAqL1xuICBwdWJsaWMgY29udGFpbmVyOiBzdHJpbmc7XG59XG4iXX0=