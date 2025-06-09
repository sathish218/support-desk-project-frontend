import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Aside from "./Aside";
import Header from "./Header";
import UserPage from "./UserPage";
import Request from "./Request";
import ITDashboard from "./ItSupport";
import TicketAnalytics from "./TicketAnalytics";
import HomePage from "./HomePage";
import List from "./List";
import EmployeeRequests from "./EmployeeRequests";
  // Import UserPage component // Assuming Dummy is a separate file for the placeholder content

function App() {
  return (
    <Router>
      <Header />
      <div className="flex">
        <Aside />
        <div className="flex-1 p-4">
          <Routes>
            {/* Your existing routes */}
            {/* />
            
            <Route path="/files" element={<Dummy title="File Manager" />} />
            <Route path="/cart" element={<Dummy title="Cart" />} />
            <Route path="/saved" element={<Dummy title="Saved Items" />} />*/}
             <Route path="/" element={<HomePage/>}/>
             <Route path="/support-desk" element={<ITDashboard/>} /> 
             <Route path="/analytics" element={<TicketAnalytics/>} />
            <Route path="/request" element={<Request/>}/>
            {/* Add the UserPage route */}
            <Route path="/user" element={<UserPage/>} />  {/* New UserPage route */}
            <Route path="/list" element = {<List/>}/>
            <Route path="/employee/:email" element={<EmployeeRequests/>} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
