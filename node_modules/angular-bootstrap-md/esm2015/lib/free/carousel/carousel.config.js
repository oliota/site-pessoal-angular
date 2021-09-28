import { Injectable } from '@angular/core';
export class CarouselConfig {
    constructor() {
        /** Default interval of auto changing of slides */
        this.interval = 5000;
        /** Is loop of auto changing of slides can be paused */
        this.noPause = false;
        /** Is slides can wrap from the last to the first slide */
        this.noWrap = false;
        this.keyboard = false;
    }
}
CarouselConfig.decorators = [
    { type: Injectable }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ib290c3RyYXAtbWQvc3JjL2xpYi9mcmVlL2Nhcm91c2VsL2Nhcm91c2VsLmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE1BQU0sT0FBTyxjQUFjO0lBRDNCO1FBRUUsa0RBQWtEO1FBQzNDLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFFdkIsdURBQXVEO1FBQ2hELFlBQU8sR0FBRyxLQUFLLENBQUM7UUFFdkIsMERBQTBEO1FBQ25ELFdBQU0sR0FBRyxLQUFLLENBQUM7UUFFZixhQUFRLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7OztZQVpBLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDYXJvdXNlbENvbmZpZyB7XG4gIC8qKiBEZWZhdWx0IGludGVydmFsIG9mIGF1dG8gY2hhbmdpbmcgb2Ygc2xpZGVzICovXG4gIHB1YmxpYyBpbnRlcnZhbCA9IDUwMDA7XG5cbiAgLyoqIElzIGxvb3Agb2YgYXV0byBjaGFuZ2luZyBvZiBzbGlkZXMgY2FuIGJlIHBhdXNlZCAqL1xuICBwdWJsaWMgbm9QYXVzZSA9IGZhbHNlO1xuXG4gIC8qKiBJcyBzbGlkZXMgY2FuIHdyYXAgZnJvbSB0aGUgbGFzdCB0byB0aGUgZmlyc3Qgc2xpZGUgKi9cbiAgcHVibGljIG5vV3JhcCA9IGZhbHNlO1xuXG4gIHB1YmxpYyBrZXlib2FyZCA9IGZhbHNlO1xufVxuIl19