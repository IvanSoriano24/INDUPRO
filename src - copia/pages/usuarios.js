import "bootstrap/dist/css/bootstrap.min.css"
import { useState } from "react"
import {TabContent, TabPane, Nav, NavItem, NavLink  } from "reactstrap"


const Usuarios  = () => {
    const [activeTab, setActiveTab] = useState("1");

    const cambiarTab = (numeroTab) =>{
        if(activeTab !== numeroTab){
            setActiveTab(numeroTab);
        }
    }
    return (
        <div className="prueba">
        <Nav tabs>
            <NavItem>
                <NavLink 
                onClick={()=>cambiarTab("1")}
                className={(activeTab=="1" ? "activeTab baseTap": "baseTap")}
                >
                    Parrafo 1
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink 
                onClick={()=>cambiarTab("2")}
                className={(activeTab=="2" ? "activeTab baseTap": "baseTap")}
                >
                    Parrafo 2
                </NavLink>
            </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
                <h1>Prueba 1</h1>
            </TabPane>

            <TabPane tabId="2">
                <h1>Prueba 2</h1>
            </TabPane>
        </TabContent>
    </div>
    )
}

export default Usuarios