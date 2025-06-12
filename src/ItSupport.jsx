import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loader from "./Loader";
import emailjs from "@emailjs/browser";

const ItSupport = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [emailBody, setEmailBody] = useState("");
  const [user, setUser] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

const BASE_URL = "https://sathish07-support-desk-project.hf.space"; // Local backend


  const token = localStorage.getItem("token");

  useEffect(() => {
    document.title = "IT Support Dashboard";

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      alert("You must be logged in");
      return;
    }
    setUser(storedUser);
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    setLoading(true);
    const delay = new Promise((resolve) => setTimeout(resolve, 1500));
    try {
      const res = await fetch(`${BASE_URL}/api/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      await Promise.all([delay]);
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests =
    priorityFilter === "all"
      ? requests
      : requests.filter((req) => req.priority === priorityFilter);

  if (!user) return <AlertBox>Loading user data...</AlertBox>;

  const userRole = user.role.toLowerCase();
  if (userRole !== "employee" && userRole !== "it-support")
    return <AlertBox>You do not have permission to access this page.</AlertBox>;

  const handleStatusChange = async (requestId, newStatus) => {
    if (userRole !== "it-support") {
      alert("Access denied: Only IT-support can change status.");
      return;
    }

    setUpdatingStatus(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/requests/${requestId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      await fetchAllRequests();
      await new Promise((r) => setTimeout(r, 1500));

      if (res.ok) {
        alert("Status updated successfully.");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status.");
    }
    setUpdatingStatus(false);
  };

  const handleSendEmail = async () => {
    if (!emailBody.trim() || !selectedRequest) return;

    if (userRole !== "it-support") {
      alert("Access denied: Only IT-support can send emails.");
      return;
    }

    setSendingEmail(true);
    try {
      const templateParams = {
        to_email: selectedRequest.email,
        to_name: selectedRequest.employeeName,
        from_name: user.name,
        message: emailBody,
      };

      await emailjs.send(
        "service_lueyybl",     // replace with your EmailJS service ID
        "your_template_id",    // replace with your EmailJS template ID
        templateParams,
        "gp1KYWpo6CswIDiyS="      // replace with your EmailJS public key
      );

      await new Promise((r) => setTimeout(r, 1500));
      alert("Email sent successfully via EmailJS.");
      setEmailBody("");
    } catch (error) {
      console.error("EmailJS sending failed:", error);
      alert("Failed to send email.");
    }
    setSendingEmail(false);
  };

  const handleElaborateEmail = async () => {
    if (!emailBody.trim()) {
      alert("Type something first to get elaboration.");
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/generate-ai-reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: emailBody }),
      });

      if (res.ok) {
        const data = await res.json();
        setEmailBody(data.reply);
      } else {
        alert("Failed to get AI elaboration");
      }
    } catch (error) {
      console.error("AI elaboration failed:", error);
      alert("Failed to get AI elaboration.");
    }
    setAiLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <>
      {(updatingStatus || sendingEmail || aiLoading) && <LoadingOverlay><Loader /></LoadingOverlay>}

      <DashboardWrapper>
        <PageTitle>IT Support Dashboard</PageTitle>

        <RequestPanel>
          <PanelHeader>
            <h2>Support Requests</h2>
            <FilterButtons>
              {["all", "high", "medium", "low"].map((level) => (
                <FilterButton
                  key={level}
                  $active={priorityFilter === level}
                  onClick={() => setPriorityFilter(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </FilterButton>
              ))}
            </FilterButtons>
          </PanelHeader>

          {filteredRequests.length === 0 ? (
            <EmptyState>No requests found for this filter.</EmptyState>
          ) : (
            filteredRequests.map((req) => (
              <ChatBubble
                key={req.id}
                priority={req.priority}
                onClick={() => setSelectedRequest(req)}
              >
                <Header>
                  <EmployeeInfo>
                    <EmployeeName>{req.employeeName}</EmployeeName>
                    <EmailText>{req.email}</EmailText>
                  </EmployeeInfo>
                  <PriorityTag priority={req.priority}>
                    {req.priority.toUpperCase()}
                  </PriorityTag>
                </Header>
                <Message>{req.message}</Message>
                <RequestMeta>
                  Submitted: {new Date(req.createdAt).toLocaleString()}
                </RequestMeta>
                <StatusSection>
                  <label>Status:</label>
                  <StatusSelect
                    value={req.status.toLowerCase()}
                    onChange={(e) => handleStatusChange(req.id, e.target.value)}
                    disabled={
                      userRole !== "it-support" || updatingStatus || sendingEmail || aiLoading
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </StatusSelect>
                  <StatusBadge status={req.status.toLowerCase()}>
                    {req.status.toUpperCase()}
                  </StatusBadge>
                </StatusSection>
              </ChatBubble>
            ))
          )}
        </RequestPanel>

        <DetailPanel>
          {selectedRequest ? (
            <>
              <ReplyHeader>Reply to: {selectedRequest.email}</ReplyHeader>
              <TextArea
                rows="10"
                placeholder="Type your reply here..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                disabled={
                  userRole !== "it-support" || sendingEmail || updatingStatus || aiLoading
                }
              />
              {userRole === "it-support" ? (
                <ButtonRow>
                  <SendButton
                    onClick={handleSendEmail}
                    disabled={
                      !emailBody.trim() || sendingEmail || updatingStatus || aiLoading
                    }
                  >
                    {sendingEmail ? "Sending..." : "Send Email"}
                  </SendButton>

                  <ElaborateButton
                    onClick={handleElaborateEmail}
                    disabled={aiLoading || sendingEmail || updatingStatus}
                  >
                    {aiLoading ? "Elaborating..." : "Suggest Elaboration"}
                  </ElaborateButton>
                </ButtonRow>
              ) : (
                <AlertBox>Only IT-support can send email replies.</AlertBox>
              )}
            </>
          ) : (
            <EmptyState>Select a request to view and reply</EmptyState>
          )}
        </DetailPanel>
      </DashboardWrapper>
    </>
  );
};





//
// ---------- Styled Components Below ----------
//

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DashboardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 24px;
  gap: 24px;
  background: #f9fafb;
  min-height: 100vh;
`;

const PageTitle = styled.h1`
  width: 100%;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

const RequestPanel = styled.section`
  flex: 1 1 48%;
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.1);
  max-height: 80vh;
  overflow-y: auto;
`;

const DetailPanel = styled.section`
  flex: 1 1 48%;
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.1);
  max-height: 80vh;
  overflow-y: auto;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: none;
  background: ${(props) => (props.$active ? "#1976d2" : "#ddd")};
  color: ${(props) => (props.$active ? "white" : "#333")};
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.$active ? "#145a9e" : "#ccc")};
  }
`;

const ChatBubble = styled.div`
  border: 1px solid #eee;
  border-left: 8px solid
    ${(props) =>
      props.priority === "high"
        ? "#d32f2f"
        : props.priority === "medium"
        ? "#fbc02d"
        : "#388e3c"};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f1f1f1;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const EmployeeInfo = styled.div``;

const EmployeeName = styled.h3`
  margin: 0 0 2px 0;
  font-weight: 600;
`;

const EmailText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #666;
`;

const PriorityTag = styled.span`
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  background-color: ${(props) =>
    props.priority === "high"
      ? "#ff8a80"
      : props.priority === "medium"
      ? "#fff59d"
      : "#a5d6a7"};
  color: ${(props) =>
    props.priority === "high" ? "#b71c1c" : props.priority === "medium" ? "#f57f17" : "#2e7d32"};
`;

const Message = styled.p`
  font-size: 15px;
  margin-bottom: 8px;
  white-space: pre-wrap;
`;

const RequestMeta = styled.div`
  font-size: 11px;
  color: #999;
`;

const StatusSection = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    font-weight: 600;
    font-size: 14px;
  }
`;

const StatusSelect = styled.select`
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #bbb;
  cursor: pointer;
`;

const StatusBadge = styled.span`
  background-color: ${(props) =>
    props.status === "pending"
      ? "#ffeb3b"
      : props.status === "resolved"
      ? "#4caf50"
      : "#f44336"};
  color: ${(props) =>
    props.status === "pending"
      ? "#666"
      : "white"};
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 13px;
`;

const ReplyHeader = styled.h2`
  margin-top: 0;
  font-weight: 700;
  color: #333;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px;
  font-size: 15px;
  font-family: Arial, sans-serif;
  border-radius: 10px;
  border: 1px solid #ccc;
  resize: vertical;
  margin-bottom: 16px;

  &:disabled {
    background: #f0f0f0;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
`;

const SendButton = styled.button`
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s;

  &:disabled {
    background-color: #90caf9;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #115293;
  }
`;

const ElaborateButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s;

  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #388e3c;
  }
`;

const EmptyState = styled.div`
  color: #777;
  font-size: 16px;
  margin-top: 24px;
  text-align: center;
`;

const AlertBox = styled.div`
  color: #b00020;
  font-weight: 700;
  text-align: center;
  margin-top: 50px;
`;

export default ItSupport;
