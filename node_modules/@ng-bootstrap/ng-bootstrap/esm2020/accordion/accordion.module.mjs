/* eslint-disable deprecation/deprecation */
import { NgModule } from '@angular/core';
import { NgbAccordion, NgbPanel, NgbPanelContent, NgbPanelHeader, NgbPanelTitle, NgbPanelToggle } from './accordion';
import { NgbAccordionDirective, NgbAccordionItem, NgbAccordionHeader, NgbAccordionToggle, NgbAccordionBody, NgbAccordionCollapse, NgbAccordionButton, } from './accordion.directive';
import * as i0 from "@angular/core";
export { NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbPanelHeader, NgbPanelToggle, } from './accordion';
export { NgbAccordionButton, NgbAccordionDirective, NgbAccordionItem, NgbAccordionHeader, NgbAccordionToggle, NgbAccordionBody, NgbAccordionCollapse, } from './accordion.directive';
export { NgbAccordionConfig } from './accordion-config';
const NGB_ACCORDION_DIRECTIVES = [
    NgbAccordion,
    NgbPanel,
    NgbPanelTitle,
    NgbPanelContent,
    NgbPanelHeader,
    NgbPanelToggle,
    NgbAccordionButton,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbAccordionToggle,
    NgbAccordionBody,
    NgbAccordionCollapse,
];
export class NgbAccordionModule {
}
NgbAccordionModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbAccordionModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionModule, imports: [NgbAccordion,
        NgbPanel,
        NgbPanelTitle,
        NgbPanelContent,
        NgbPanelHeader,
        NgbPanelToggle,
        NgbAccordionButton,
        NgbAccordionDirective,
        NgbAccordionItem,
        NgbAccordionHeader,
        NgbAccordionToggle,
        NgbAccordionBody,
        NgbAccordionCollapse], exports: [NgbAccordion,
        NgbPanel,
        NgbPanelTitle,
        NgbPanelContent,
        NgbPanelHeader,
        NgbPanelToggle,
        NgbAccordionButton,
        NgbAccordionDirective,
        NgbAccordionItem,
        NgbAccordionHeader,
        NgbAccordionToggle,
        NgbAccordionBody,
        NgbAccordionCollapse] });
NgbAccordionModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionModule, imports: [NgbAccordion,
        NgbAccordionBody] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: NGB_ACCORDION_DIRECTIVES,
                    exports: NGB_ACCORDION_DIRECTIVES,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hY2NvcmRpb24vYWNjb3JkaW9uLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0Q0FBNEM7QUFDNUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDckgsT0FBTyxFQUNOLHFCQUFxQixFQUNyQixnQkFBZ0IsRUFDaEIsa0JBQWtCLEVBQ2xCLGtCQUFrQixFQUNsQixnQkFBZ0IsRUFDaEIsb0JBQW9CLEVBQ3BCLGtCQUFrQixHQUNsQixNQUFNLHVCQUF1QixDQUFDOztBQUUvQixPQUFPLEVBQ04sWUFBWSxFQUNaLFFBQVEsRUFDUixhQUFhLEVBQ2IsZUFBZSxFQUVmLGNBQWMsRUFFZCxjQUFjLEdBQ2QsTUFBTSxhQUFhLENBQUM7QUFFckIsT0FBTyxFQUNOLGtCQUFrQixFQUNsQixxQkFBcUIsRUFDckIsZ0JBQWdCLEVBQ2hCLGtCQUFrQixFQUNsQixrQkFBa0IsRUFDbEIsZ0JBQWdCLEVBQ2hCLG9CQUFvQixHQUNwQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXhELE1BQU0sd0JBQXdCLEdBQUc7SUFDaEMsWUFBWTtJQUNaLFFBQVE7SUFDUixhQUFhO0lBQ2IsZUFBZTtJQUNmLGNBQWM7SUFDZCxjQUFjO0lBQ2Qsa0JBQWtCO0lBQ2xCLHFCQUFxQjtJQUNyQixnQkFBZ0I7SUFDaEIsa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUNsQixnQkFBZ0I7SUFDaEIsb0JBQW9CO0NBQ3BCLENBQUM7QUFNRixNQUFNLE9BQU8sa0JBQWtCOzsrR0FBbEIsa0JBQWtCO2dIQUFsQixrQkFBa0IsWUFuQjlCLFlBQVk7UUFDWixRQUFRO1FBQ1IsYUFBYTtRQUNiLGVBQWU7UUFDZixjQUFjO1FBQ2QsY0FBYztRQUNkLGtCQUFrQjtRQUNsQixxQkFBcUI7UUFDckIsZ0JBQWdCO1FBQ2hCLGtCQUFrQjtRQUNsQixrQkFBa0I7UUFDbEIsZ0JBQWdCO1FBQ2hCLG9CQUFvQixhQVpwQixZQUFZO1FBQ1osUUFBUTtRQUNSLGFBQWE7UUFDYixlQUFlO1FBQ2YsY0FBYztRQUNkLGNBQWM7UUFDZCxrQkFBa0I7UUFDbEIscUJBQXFCO1FBQ3JCLGdCQUFnQjtRQUNoQixrQkFBa0I7UUFDbEIsa0JBQWtCO1FBQ2xCLGdCQUFnQjtRQUNoQixvQkFBb0I7Z0hBT1Isa0JBQWtCLFlBbkI5QixZQUFZO1FBV1osZ0JBQWdCOzJGQVFKLGtCQUFrQjtrQkFKOUIsUUFBUTttQkFBQztvQkFDVCxPQUFPLEVBQUUsd0JBQXdCO29CQUNqQyxPQUFPLEVBQUUsd0JBQXdCO2lCQUNqQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uICovXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBOZ2JBY2NvcmRpb24sIE5nYlBhbmVsLCBOZ2JQYW5lbENvbnRlbnQsIE5nYlBhbmVsSGVhZGVyLCBOZ2JQYW5lbFRpdGxlLCBOZ2JQYW5lbFRvZ2dsZSB9IGZyb20gJy4vYWNjb3JkaW9uJztcbmltcG9ydCB7XG5cdE5nYkFjY29yZGlvbkRpcmVjdGl2ZSxcblx0TmdiQWNjb3JkaW9uSXRlbSxcblx0TmdiQWNjb3JkaW9uSGVhZGVyLFxuXHROZ2JBY2NvcmRpb25Ub2dnbGUsXG5cdE5nYkFjY29yZGlvbkJvZHksXG5cdE5nYkFjY29yZGlvbkNvbGxhcHNlLFxuXHROZ2JBY2NvcmRpb25CdXR0b24sXG59IGZyb20gJy4vYWNjb3JkaW9uLmRpcmVjdGl2ZSc7XG5cbmV4cG9ydCB7XG5cdE5nYkFjY29yZGlvbixcblx0TmdiUGFuZWwsXG5cdE5nYlBhbmVsVGl0bGUsXG5cdE5nYlBhbmVsQ29udGVudCxcblx0TmdiUGFuZWxDaGFuZ2VFdmVudCxcblx0TmdiUGFuZWxIZWFkZXIsXG5cdE5nYlBhbmVsSGVhZGVyQ29udGV4dCxcblx0TmdiUGFuZWxUb2dnbGUsXG59IGZyb20gJy4vYWNjb3JkaW9uJztcblxuZXhwb3J0IHtcblx0TmdiQWNjb3JkaW9uQnV0dG9uLFxuXHROZ2JBY2NvcmRpb25EaXJlY3RpdmUsXG5cdE5nYkFjY29yZGlvbkl0ZW0sXG5cdE5nYkFjY29yZGlvbkhlYWRlcixcblx0TmdiQWNjb3JkaW9uVG9nZ2xlLFxuXHROZ2JBY2NvcmRpb25Cb2R5LFxuXHROZ2JBY2NvcmRpb25Db2xsYXBzZSxcbn0gZnJvbSAnLi9hY2NvcmRpb24uZGlyZWN0aXZlJztcbmV4cG9ydCB7IE5nYkFjY29yZGlvbkNvbmZpZyB9IGZyb20gJy4vYWNjb3JkaW9uLWNvbmZpZyc7XG5cbmNvbnN0IE5HQl9BQ0NPUkRJT05fRElSRUNUSVZFUyA9IFtcblx0TmdiQWNjb3JkaW9uLFxuXHROZ2JQYW5lbCxcblx0TmdiUGFuZWxUaXRsZSxcblx0TmdiUGFuZWxDb250ZW50LFxuXHROZ2JQYW5lbEhlYWRlcixcblx0TmdiUGFuZWxUb2dnbGUsXG5cdE5nYkFjY29yZGlvbkJ1dHRvbixcblx0TmdiQWNjb3JkaW9uRGlyZWN0aXZlLFxuXHROZ2JBY2NvcmRpb25JdGVtLFxuXHROZ2JBY2NvcmRpb25IZWFkZXIsXG5cdE5nYkFjY29yZGlvblRvZ2dsZSxcblx0TmdiQWNjb3JkaW9uQm9keSxcblx0TmdiQWNjb3JkaW9uQ29sbGFwc2UsXG5dO1xuXG5ATmdNb2R1bGUoe1xuXHRpbXBvcnRzOiBOR0JfQUNDT1JESU9OX0RJUkVDVElWRVMsXG5cdGV4cG9ydHM6IE5HQl9BQ0NPUkRJT05fRElSRUNUSVZFUyxcbn0pXG5leHBvcnQgY2xhc3MgTmdiQWNjb3JkaW9uTW9kdWxlIHt9XG4iXX0=