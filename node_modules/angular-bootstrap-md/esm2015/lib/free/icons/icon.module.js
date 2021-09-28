import { MdbIconComponent } from './icon.component';
import { NgModule } from '@angular/core';
import { FabDirective } from './directives/fab.directive';
import { FarDirective } from './directives/far.directive';
import { FasDirective } from './directives/fas.directive';
import { FalDirective } from './directives/fal.directive';
import { CommonModule } from '@angular/common';
import { FadDirective } from './directives/fad.directive';
export class IconsModule {
}
IconsModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    MdbIconComponent,
                    FabDirective,
                    FarDirective,
                    FasDirective,
                    FalDirective,
                    FadDirective,
                ],
                imports: [CommonModule],
                exports: [MdbIconComponent, FabDirective, FarDirective, FasDirective, FalDirective, FadDirective],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWJvb3RzdHJhcC1tZC9zcmMvbGliL2ZyZWUvaWNvbnMvaWNvbi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDcEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzFELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQWMxRCxNQUFNLE9BQU8sV0FBVzs7O1lBWnZCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUU7b0JBQ1osZ0JBQWdCO29CQUNoQixZQUFZO29CQUNaLFlBQVk7b0JBQ1osWUFBWTtvQkFDWixZQUFZO29CQUNaLFlBQVk7aUJBQ2I7Z0JBQ0QsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUN2QixPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDO2FBQ2xHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWRiSWNvbkNvbXBvbmVudCB9IGZyb20gJy4vaWNvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZhYkRpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9mYWIuZGlyZWN0aXZlJztcbmltcG9ydCB7IEZhckRpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9mYXIuZGlyZWN0aXZlJztcbmltcG9ydCB7IEZhc0RpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9mYXMuZGlyZWN0aXZlJztcbmltcG9ydCB7IEZhbERpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9mYWwuZGlyZWN0aXZlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBGYWREaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvZmFkLmRpcmVjdGl2ZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE1kYkljb25Db21wb25lbnQsXG4gICAgRmFiRGlyZWN0aXZlLFxuICAgIEZhckRpcmVjdGl2ZSxcbiAgICBGYXNEaXJlY3RpdmUsXG4gICAgRmFsRGlyZWN0aXZlLFxuICAgIEZhZERpcmVjdGl2ZSxcbiAgXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNZGJJY29uQ29tcG9uZW50LCBGYWJEaXJlY3RpdmUsIEZhckRpcmVjdGl2ZSwgRmFzRGlyZWN0aXZlLCBGYWxEaXJlY3RpdmUsIEZhZERpcmVjdGl2ZV0sXG59KVxuZXhwb3J0IGNsYXNzIEljb25zTW9kdWxlIHt9XG4iXX0=