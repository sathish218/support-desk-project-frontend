// TicketAnalytics.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const COLORS = ["#1976d2", "#43a047", "#e53935"];
const STATUS_ORDER = ["Pending", "Resolved", "Rejected"];

const TicketAnalytics = () => {
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

const BASE_URL = "https://sathish07-support-desk-project.hf.space"; // Local backend


  useEffect(() => {
    document.title = "Ticket Analytics";
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/requests/status-counts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const formattedStatus = Object.entries(data).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
      }));
      formattedStatus.sort((a, b) => STATUS_ORDER.indexOf(a.name) - STATUS_ORDER.indexOf(b.name));
      setStatusData(formattedStatus);
    } catch (error) {
      console.error("Error fetching status counts:", error);
      setStatusData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <Header>
          <Title>Ticket Analytics Dashboard</Title>
          <SubTitle>Loading data...</SubTitle>
        </Header>
      </Wrapper>
    );
  }

  const totalRequests = statusData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Wrapper>
      <Header>
        <Title>Ticket Analytics Dashboard</Title>
        <SubTitle>Monitor request statuses and team efficiency</SubTitle>
      </Header>

      <SummarySection>
        <MetricCard>
          <MetricLabel>Total Requests</MetricLabel>
          <MetricValue>{totalRequests}</MetricValue>
        </MetricCard>

        {statusData.map(({ name, value }, idx) => (
          <MetricCard key={name} borderColor={COLORS[idx]}>
            <MetricLabel>{name}</MetricLabel>
            <MetricValue style={{ color: COLORS[idx] }}>{value}</MetricValue>
          </MetricCard>
        ))}
      </SummarySection>

      {statusData.length === 0 ? (
        <NoData>No status data available</NoData>
      ) : (
        <ChartsWrapper>
          <ChartCard>
            <ChartTitle>Status Distribution</ChartTitle>
            <PieChart width={380} height={320}>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Status Breakdown</ChartTitle>
            <BarChart width={500} height={300} data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartCard>
        </ChartsWrapper>
      )}
    </Wrapper>
  );
};

export default TicketAnalytics;


//
// Styled Components
//
const Wrapper = styled.div`
  padding: 40px;
  background-color: #f4f6f8;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  color: #2e2e2e;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
`;

const SubTitle = styled.p`
  font-size: 16px;
  color: #5f6368;
`;

const SummarySection = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 48px;
`;

const MetricCard = styled.div`
  background: white;
  padding: 24px 28px;
  border-radius: 12px;
  border-left: 6px solid ${(props) => props.borderColor || "#ccc"};
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  min-width: 200px;
  text-align: center;
`;

const MetricLabel = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
`;

const MetricValue = styled.h2`
  font-size: 36px;
  font-weight: 700;
  margin: 0;
`;

const ChartsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
`;

const ChartCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 540px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 600px) {
    width: 100%;
    padding: 20px;
  }
`;

const ChartTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
`;

const NoData = styled.div`
  text-align: center;
  font-size: 18px;
  color: #999;
  margin-top: 60px;
`;
