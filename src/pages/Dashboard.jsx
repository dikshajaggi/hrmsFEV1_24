import { useContext } from "react";
import { RenderWidgets } from "../utils/RenderWidgets";
import { MainContext } from "../context/MainContext";

const Dashboard = () => {
  const {userDetails} = useContext(MainContext)
  const role = userDetails.roles[0].toLowerCase()
  // const [runTour, setRunTour] = useState(true);

  //   const steps = [
  //     {
  //       target: ".stats-section",
  //       content: "Here you can see today's attendance summary."
  //     },
  //     {
  //       target: ".charts-section",
  //       content: "These charts show leave trends for better HR insights."
  //     },
  //     {
  //       target: ".insights-section",
  //       content: "These widgets provide department analytics and HR activity."
  //     },
  //     {
  //       target: ".notifications-widget",
  //       content: "Notifications keep HR updated about important events."
  //     },
  //     {
  //       target: ".quicklinks-widget",
  //       content: "Quick actions allow you to perform frequent tasks quickly."
  //     }
  //   ];

  return (
    <>
    {/* <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
      /> */}
    <div className="grid grid-cols-12 gap-6 h-100% mb-4">

      {/* MAIN */}
      <div className="col-span-12 xl:col-span-9 flex flex-col gap-6">

        {/* STATS */}
        <div className="stats-section">{RenderWidgets("main","stats", role)}</div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {RenderWidgets("main","charts", role)}
        </div>

        {/* INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {RenderWidgets("main","insights", role)}
        </div>

      </div>


      {/* RIGHT PANEL */}
      <div className="col-span-12 xl:col-span-3 flex flex-col gap-6">

        {RenderWidgets("right","top", role)}

        {RenderWidgets("right","middle", role)}

        {RenderWidgets("right","lower", role)}

      </div>
    </div>
    </>
  );
};

export default Dashboard;