// import React, { useEffect, useState } from "react";
// import styled from "styled-components";
// import {
//   PieChart, Pie, Cell, Tooltip, Legend,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
// } from "recharts";

// const COLORS = ["#FFA500", "#4CAF50", "#F44336"]; // Pending, Resolved, Rejected

// const HomePage = () => {
//   const [requests, setRequests] = useState([]);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [emailBody, setEmailBody] = useState("");
//   const [statusData, setStatusData] = useState([]);
//   const [uniqueUsers, setUniqueUsers] = useState(0);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchAllRequests();
//     fetchStatusCounts();
//     fetchUniqueUsers();
//   }, []);

//   const fetchAllRequests = async () => {
//     try {
//       const res = await fetch("http://localhost:8080/api/requests", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setRequests(data);
//     } catch (error) {
//       console.error("Error fetching requests:", error);
//     }
//   };

//   const fetchStatusCounts = async () => {
//     try {
//       const res = await fetch("http://localhost:8080/api/requests/status-counts", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();

//       const formattedData = Object.entries(data).map(([key, value]) => ({
//         name: key.charAt(0).toUpperCase() + key.slice(1),
//         value,
//       }));

//       setStatusData(formattedData);
//     } catch (error) {
//       console.error("Error fetching status counts:", error);
//     }
//   };

//   const fetchUniqueUsers = async () => {
//     try {
//       const res = await fetch("http://localhost:8080/api/requests/user-count", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setUniqueUsers(data.uniqueUsers);
//     } catch (error) {
//       console.error("Error fetching unique users:", error);
//     }
//   };

//   const handleSendEmail = async () => {
//     if (!emailBody || !selectedRequest) return;

//     try {
//       const res = await fetch("http://localhost:8080/api/send-email", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           to: selectedRequest.email,
//           subject: "Support Request Update",
//           body: emailBody,
//         }),
//       });

//       if (res.ok) {
//         alert("Email sent successfully");
//         setEmailBody("");
//       } else {
//         alert("Failed to send email");
//       }
//     } catch (error) {
//       console.error("Email sending failed:", error);
//     }
//   };

//   // Calculate summary stats
//   const totalRequests = requests.length;
//   const pendingCount = requests.filter(r => r.status === "pending").length;
//   const resolvedCount = requests.filter(r => r.status === "resolved").length;
//   const rejectedCount = requests.filter(r => r.status === "rejected").length;

//   return (
//     <PageWrapper>
//       <Header>Support Desk Dashboard</Header>

//       <SummaryContainer>
//         <SummaryCard>
//           <SummaryIcon>📨</SummaryIcon>
//           <SummaryTitle>Total Requests</SummaryTitle>
//           <SummaryValue>{totalRequests}</SummaryValue>
//         </SummaryCard>
//         <SummaryCard>
//           <SummaryIcon>🟠</SummaryIcon>
//           <SummaryTitle>Pending</SummaryTitle>
//           <SummaryValue>{pendingCount}</SummaryValue>
//         </SummaryCard>
//         <SummaryCard>
//           <SummaryIcon>🟢</SummaryIcon>
//           <SummaryTitle>Resolved</SummaryTitle>
//           <SummaryValue>{resolvedCount}</SummaryValue>
//         </SummaryCard>
//         <SummaryCard>
//           <SummaryIcon>🔴</SummaryIcon>
//           <SummaryTitle>Rejected</SummaryTitle>
//           <SummaryValue>{rejectedCount}</SummaryValue>
//         </SummaryCard>
//         <SummaryCard>
//           <SummaryIcon>👥</SummaryIcon>
//           <SummaryTitle>Unique Users</SummaryTitle>
//           <SummaryValue>{uniqueUsers}</SummaryValue>
//         </SummaryCard>
//       </SummaryContainer>

//       <ChartsContainer>
//         <ChartBox>
//           <h3>Request Status Distribution (Pie)</h3>
//           <PieChart width={300} height={250}>
//             <Pie
//               data={statusData}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               outerRadius={80}
//               label
//             >
//               {statusData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </ChartBox>

//         <ChartBox>
//           <h3>Request Status Counts (Bar)</h3>
//           <BarChart width={400} height={250} data={statusData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis allowDecimals={false} />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="value" fill="#4caf50" />
//           </BarChart>
//         </ChartBox>
//       </ChartsContainer>

//       <RequestsSection>
//         <h2>All Requests</h2>
//         <RequestList>
//           {requests.map(req => (
//             <RequestCard
//               key={req.id}
//               onClick={() => setSelectedRequest(req)}
//               selected={selectedRequest?.id === req.id}
//               priority={req.priority}
//             >
//               <div>
//                 <strong>{req.employeeName}</strong> ({req.email})
//               </div>
//               <MessagePreview>{req.message.slice(0, 60)}...</MessagePreview>
//               <SmallText>
//                 Priority: <PriorityTag priority={req.priority}>{req.priority}</PriorityTag> | Status: <StatusTag status={req.status}>{req.status}</StatusTag>
//               </SmallText>
//               <SmallText>Submitted: {new Date(req.createdAt).toLocaleString()}</SmallText>
//             </RequestCard>
//           ))}
//         </RequestList>

//         <ReplyPanel>
//           {selectedRequest ? (
//             <>
//               <h3>Reply to: {selectedRequest.email}</h3>
//               <TextArea
//                 rows={6}
//                 placeholder="Type your reply here..."
//                 value={emailBody}
//                 onChange={e => setEmailBody(e.target.value)}
//               />
//               <SendButton onClick={handleSendEmail}>Send Email</SendButton>
//             </>
//           ) : (
//             <NoSelection>Please select a request to reply.</NoSelection>
//           )}
//         </ReplyPanel>
//       </RequestsSection>
//     </PageWrapper>
//   );
// };

// const PageWrapper = styled.div`
//   padding: 30px;
//   font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
//   max-width: 1200px;
//   margin: auto;
// `;

// const Header = styled.h1`
//   text-align: center;
//   margin-bottom: 30px;
//   color: #1089d3;
// `;

// const SummaryContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 40px;
//   flex-wrap: wrap;
//   gap: 15px;
// `;

// const SummaryCard = styled.div`
//   flex: 1 1 160px;
//   background: #f4f6f8;
//   padding: 25px;
//   border-radius: 15px;
//   text-align: center;
//   box-shadow: 0 3px 10px rgba(16, 137, 211, 0.2);
//   cursor: default;
//   transition: transform 0.2s ease;

//   &:hover {
//     transform: scale(1.05);
//   }
// `;

// const SummaryIcon = styled.div`
//   font-size: 40px;
//   margin-bottom: 10px;
// `;

// const SummaryTitle = styled.div`
//   font-weight: 600;
//   font-size: 18px;
//   margin-bottom: 6px;
//   color: #333;
// `;

// const SummaryValue = styled.div`
//   font-size: 28px;
//   font-weight: 700;
//   color: #1089d3;
// `;

// const ChartsContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   gap: 60px;
//   margin-bottom: 50px;
//   flex-wrap: wrap;
// `;

// const ChartBox = styled.div`
//   background: #f4f6f8;
//   padding: 25px;
//   border-radius: 15px;
//   box-shadow: 0 3px 12px rgba(0,0,0,0.1);
//   text-align: center;
//   min-width: 320px;
// `;

// const RequestsSection = styled.div`
//   display: flex;
//   gap: 25px;
//   flex-wrap: wrap;
//   justify-content: space-between;
// `;

// const RequestList = styled.div`
//   flex: 1 1 600px;
//   max-height: 550px;
//   overflow-y: auto;
//   background: #f9fafb;
//   border-radius: 15px;
//   padding: 20px;
//   box-shadow: 0 3px 10px rgba(16,137,211,0.1);
// `;

// const RequestCard = styled.div`
//   background-color: ${(props) =>
//     props.priority === "high"
//       ? "#ffe5e5"
//       : props.priority === "medium"
//       ? "#fffacc"
//       : "#e6f7ff"};
//   border-radius: 12px;
//   padding: 15px 20px;
//   margin-bottom: 15px;
//   cursor: pointer;
//   border: ${(props) => (props.selected ? "3px solid #1089d3" : "none")};
//   transition: border 0.3s ease;

//   &:hover {
//     border: 3px solid #1089d3;
//   }
// `;

// const MessagePreview = styled.p`
//   margin: 8px 0;
//   color: #444;
//   font-style: italic;
// `;

// const SmallText = styled.div`
//   font-size: 13px;
//   color: #555;
//   margin-top: 4px;
// `;

// const PriorityTag = styled.span`
//   color: white;
//   padding: 4px 10px;
//   border-radius: 12px;
//   font-weight: 700;
//   background-color: ${(props) =>
//     props.priority === "high" ? "#e53935" :
//     props.priority === "medium" ? "#fbc02d" :
//     "#42a5f5"};
// `;

// const StatusTag = styled.span`
//   text-transform: capitalize;
//   font-weight: 600;
//   color: ${(props) =>
//     props.status === "pending" ? "#f57c00" :
//     props.status === "resolved" ? "#2e7d32" :
//     props.status === "rejected" ? "#c62828" : "#555"};
// `;

// const ReplyPanel = styled.div`
//   flex: 1 1 350px;
//   background: #f4f6f8;
//   padding: 25px;
//   border-radius: 15px;
//   box-shadow: 0 3px 10px rgba(0,0,0,0.1);
//   min-height: 300px;
// `;

// const TextArea = styled.textarea`
//   width: 100%;
//   padding: 12px;
//   border-radius: 12px;
//   border: 1px solid #ccc;
//   font-size: 15px;
//   resize: vertical;
//   margin-top: 10px;
//   font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
// `;

// const SendButton = styled.button`
//   margin-top: 15px;
//   background-color: #1089d3;
//   color: white;
//   font-weight: 600;
//   border: none;
//   padding: 12px 20px;
//   border-radius: 12px;
//   cursor: pointer;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: #0b71b8;
//   }
// `;

// const NoSelection = styled.div`
//   font-style: italic;
//   color: #666;
//   margin-top: 50px;
//   text-align: center;
// `;

// export default HomePage;
import React from "react";
import styled from "styled-components";

const HomePage = () => {
  return (
    <PageWrapper>
      <Header>Welcome to Your Support Desk</Header>

      <Section>
        <SectionTitle>About Our Support Desk</SectionTitle>
        <SectionContent>
          Our Support Desk is designed to streamline the way you handle customer
          requests, issues, and feedback. With an intuitive interface and
          powerful analytics, our platform helps support teams deliver fast,
          effective resolutions while keeping customers satisfied.
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>How It Works</SectionTitle>
        <StepsList>
          <Step>
            <StepNumber>1</StepNumber>
            <StepContent>
              <strong>Submit a Request:</strong> Users submit support tickets via
              the website detailing their issue or question.
            </StepContent>
          </Step>
          <Step>
            <StepNumber>2</StepNumber>
            <StepContent>
              <strong>Assign & Manage:</strong> Support agents receive and prioritize
              tickets based on urgency and category.
            </StepContent>
          </Step>
          <Step>
            <StepNumber>3</StepNumber>
            <StepContent>
              <strong>Resolve & Respond:</strong> Agents communicate with users to
              resolve issues promptly, updating ticket status as progress is made.
            </StepContent>
          </Step>
          <Step>
            <StepNumber>4</StepNumber>
            <StepContent>
              <strong>Analyze & Improve:</strong> Managers track metrics and analyze
              trends through detailed dashboards to enhance support quality.
            </StepContent>
          </Step>
        </StepsList>
      </Section>

      <Section>
        <SectionTitle>Our Key Features</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Real-Time Analytics</FeatureTitle>
            <FeatureDesc>
              Visualize support request statuses, user engagement, and response times
              to make data-driven decisions.
            </FeatureDesc>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>⚙️</FeatureIcon>
            <FeatureTitle>Ticket Management</FeatureTitle>
            <FeatureDesc>
              Organize, prioritize, and track support tickets with easy-to-use tools
              designed for efficiency.
            </FeatureDesc>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📧</FeatureIcon>
            <FeatureTitle>Email Integration</FeatureTitle>
            <FeatureDesc>
              Send and receive emails directly within the platform to keep
              communication centralized.
            </FeatureDesc>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Secure Access</FeatureTitle>
            <FeatureDesc>
              Role-based permissions and authentication ensure your data stays safe.
            </FeatureDesc>
          </FeatureCard>
        </FeaturesGrid>
      </Section>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  max-width: 900px;
  margin: 30px auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  padding: 0 20px;
`;

const Header = styled.h1`
  text-align: center;
  color: #1089d3;
  margin-bottom: 40px;
`;

const Section = styled.section`
  margin-bottom: 50px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 18px;
  border-bottom: 3px solid #1089d3;
  padding-bottom: 6px;
`;

const SectionContent = styled.p`
  font-size: 18px;
  line-height: 1.6;
`;

const StepsList = styled.ol`
  margin-left: 20px;
`;

const Step = styled.li`
  margin-bottom: 16px;
  font-size: 16px;
`;

const StepNumber = styled.span`
  font-weight: 700;
  color: #1089d3;
  margin-right: 10px;
`;

const StepContent = styled.span``;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
`;

const FeatureCard = styled.div`
  background: #f4f6f8;
  border-radius: 14px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(16, 137, 211, 0.15);
  transition: transform 0.2s ease;
  cursor: default;

  &:hover {
    transform: translateY(-6px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
`;

const FeatureTitle = styled.h3`
  margin-bottom: 8px;
  color: #1089d3;
`;

const FeatureDesc = styled.p`
  font-size: 15px;
  line-height: 1.4;
  color: #555;
`;

export default HomePage;

