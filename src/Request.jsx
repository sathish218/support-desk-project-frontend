import React, { useState } from "react";
import styled from "styled-components";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";

const RequestPage = () => {
  const [request, setRequest] = useState({ message: "", priority: "low" });
  const [status, setStatus] = useState({ message: "", isError: false });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !user?.email || !user?.name) {
      setStatus({
        message: "You must be logged in to submit a request.",
        isError: true,
      });
      return;
    }

    setLoading(true);

    const payload = {
      ...request,
      employeeName: user.name,
      email: user.email,
    };

    try {
      const res = await fetch("https://sathish07-support-desk-project.hf.space/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to send request");
      }

      setRequest({ message: "", priority: "low" });
      setStatus({
        message: "Your request has been submitted successfully.",
        isError: false,
      });
    } catch (error) {
      setStatus({
        message: error.message || "An error occurred while submitting your request.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <PageTitle>Request Page</PageTitle>

      <FormNoticeWrapper>
        <FormCard>
          <Title>Request IT Support</Title>

          <Form onSubmit={handleSubmit}>
            <Label htmlFor="message">Issue Description</Label>
            <TextArea
              id="message"
              value={request.message}
              onChange={(e) => setRequest({ ...request, message: e.target.value })}
              placeholder="Describe your issue in detail..."
              required
              rows={5}
            />

            <Label htmlFor="priority">Priority Level</Label>
            <Select
              id="priority"
              value={request.priority}
              onChange={(e) => setRequest({ ...request, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </Select>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </SubmitButton>
          </Form>

          {status.message && (
            <StatusMessage $isError={status.isError}>
              {status.isError ? (
                <FiAlertTriangle style={{ marginRight: "8px" }} />
              ) : (
                <FiCheckCircle style={{ marginRight: "8px" }} />
              )}
              {status.message}
            </StatusMessage>
          )}
        </FormCard>

        <Notice>
          <NoticeHeader>
            <FiInfo size={24} color="#0f6fc6" />
            <h3>How to Submit a Request</h3>
          </NoticeHeader>
          <p>
            Please describe your issue clearly in the description box. Choose the priority level
            according to the urgency of your problem:
          </p>
          <PriorityList>
            <PriorityItem priority="low">
              <FiAlertCircle color="#4CAF50" />
              <div>
                <strong>Low Priority</strong>
                <span>Minor issues or general inquiries</span>
              </div>
            </PriorityItem>

            <PriorityItem priority="medium">
              <FiAlertCircle color="#FFC107" />
              <div>
                <strong>Medium Priority</strong>
                <span>Problems affecting work but with workarounds</span>
              </div>
            </PriorityItem>

            <PriorityItem priority="high">
              <FiAlertCircle color="#F44336" />
              <div>
                <strong>High Priority</strong>
                <span>Critical issues needing immediate attention</span>
              </div>
            </PriorityItem>
          </PriorityList>
          <p>Our IT support team will respond based on the priority level.</p>
        </Notice>
      </FormNoticeWrapper>
    </Wrapper>
  );
};

// ------------------ Styled Components ------------------

const Wrapper = styled.div`
  padding: 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled.h1`
  color: #1e3a8a;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const FormNoticeWrapper = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  flex-wrap: wrap;
`;

const FormCard = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h2`
  color: #1e3a8a;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #334155;
  font-size: 0.875rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.875rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.875rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    background-color: #a5b4fc;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 1rem;
  background-color: ${(props) => (props.$isError ? "#fee2e2" : "#dcfce7")};
  color: ${(props) => (props.$isError ? "#b91c1c" : "#166534")};
`;

const Notice = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 500px;

  p {
    color: #475569;
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

const NoticeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  h3 {
    color: #1e3a8a;
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

const PriorityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.5rem 0;
`;

const PriorityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  background-color: ${(props) =>
    props.priority === "high"
      ? "#fef2f2"
      : props.priority === "medium"
      ? "#fffbeb"
      : "#f0fdf4"};
  border-left: 4px solid
    ${(props) =>
      props.priority === "high"
        ? "#ef4444"
        : props.priority === "medium"
        ? "#f59e0b"
        : "#10b981"};

  strong {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.875rem;
  }

  span {
    color: #64748b;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
`;

export default RequestPage;
