import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import Navbar from "./Navbar";
import Contact from "./Navbar/Contact";
import Paypal from "./Navbar/Paypal";
import Tools from "./Navbar/Tools";

import Tool from "./Tool";

const App = () => {
    const path = "https://micetf.fr";
    const tool = "Lecture Flash";

    return (
        <>
            <Navbar
                path={path}
                tool={tool}
                right={[
                    <Paypal />,
                    <Tools path={path} />,
                    <Contact tool={tool} />,
                ]}
            />
            <Tool />
        </>
    );
};

export default App;
