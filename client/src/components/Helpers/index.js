import React from "react";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import PanToolIcon from "@material-ui/icons/PanTool";
export default function Helpers() {
  return (
    <div className="helpers-component-div">
      <ContactPhoneIcon className="helper" />
      <DirectionsRunIcon className="helper" />
      <PanToolIcon className="helper giveup_helper" />
    </div>
  );
}
