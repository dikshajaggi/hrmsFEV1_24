import { dashboardConfig } from "../configs/dashboardConfig";
import {widgetsRegistery} from "../data/widgetsRegistery" 

// export const RenderWidgets = (section, row) => {
//   return dashboardConfig
//     .filter(w => w.section === section && w.row === row)
//     .sort((a,b) => a.order - b.order)
//     .map((w, index) => {
//       const Component = widgetsRegistery[w.widget];

//       if (!Component) return null;

//       return <Component key={index} />;
//     });
// };


import { Suspense } from "react";
import { WidgetShimmer } from "../shimmer/WidgetShimmer";

export const RenderWidgets = (section, row, role) => {

  return dashboardConfig
    .filter(widget =>
      widget.section === section &&
      widget.row === row &&
      widget.roles.includes(role)
    )
    .sort((a,b) => a.order - b.order)
    .map(widget => {

      const WidgetComponent = widgetsRegistery[widget.widget];

      const scope = widget.scope?.[role] || "org";

      return (
        <Suspense fallback={<WidgetShimmer />} key={widget.widget}>
          <WidgetComponent scope={scope} role={role} />
        </Suspense>
      );

    });

};