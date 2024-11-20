import React, { Fragment } from "react";
import CsvOperator from "./ui/CsvOperator";

const page = () => {
  return (
    <Fragment>
      <section className="h-[100vh] text-sm">
        <CsvOperator />;
      </section>
    </Fragment>
  );
};

export default page;
