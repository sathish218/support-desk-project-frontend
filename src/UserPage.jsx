import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiUser, FiMail, FiAward, FiLogOut } from 'react-icons/fi';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload(); // Refresh to update UI
  };

  if (loading) return <LoadingSpinner />;

  return (
    <PageContainer>
      <MainContent>
        {user ? (
          <>
            <WelcomeSection>
              <WelcomeMessage>
                <h1>Welcome back, <span>{user.name || "User"}</span></h1>
                <p>
                  {user.role === 'admin' 
                    ? "You have administrator privileges to manage the system."
                    : user.role === 'manager'
                    ? "As a manager, you can oversee team requests and approvals."
                    : "You can submit support requests and track their status."}
                </p>
              </WelcomeMessage>
            </WelcomeSection>

            <ProfileContainer>
              <ProfileCard>
                <ProfileHeader>
                  <ProfileCircle>
                    {user.name?.charAt(0).toUpperCase()}
                  </ProfileCircle>
                  <h2>{user.name || "N/A"}</h2>
                </ProfileHeader>

                <ProfileDetails>
                  <DetailItem>
                    <FiMail size={18} />
                    <div>
                      <label>Email</label>
                      <p>{user.email}</p>
                    </div>
                  </DetailItem>

                  <DetailItem>
                    <FiAward size={18} />
                    <div>
                      <label>Role</label>
                      <p>{user.role}</p>
                    </div>
                  </DetailItem>
                </ProfileDetails>

                <LogoutButton onClick={handleLogout}>
                  <FiLogOut size={18} />
                  Sign Out
                </LogoutButton>
              </ProfileCard>
            </ProfileContainer>
          </>
        ) : (
          <Message>Please login to view your profile</Message>
        )}
      </MainContent>
    </PageContainer>
  );
};

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #1089d3;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 100px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PageContainer = styled.div`
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 2rem;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WelcomeSection = styled.section`
  background: linear-gradient(135deg, #1089d3 0%, #0c6bad 100%);
  border-radius: 12px;
  padding: 2rem;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const WelcomeMessage = styled.div`
  max-width: 800px;

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
    font-weight: 600;

    span {
      font-weight: 700;
    }
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    opacity: 0.9;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProfileCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  flex: 1;
  max-width: 400px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.5rem;
    color: #1e3a8a;
    margin: 0;
  }
`;

const ProfileCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #1089d3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24px;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2rem 0;
`;

const DetailItem = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;

  svg {
    color: #64748b;
    margin-top: 3px;
  }

  div {
    flex: 1;
  }

  label {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
  }

  p {
    margin: 0;
    font-size: 1rem;
    color: #1e293b;
    font-weight: 500;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #fef2f2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  justify-content: center;

  &:hover {
    background-color: #fee2e2;
  }

  svg {
    color: inherit;
  }
`;

const Message = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  color: #64748b;
  font-size: 1.1rem;
`;

export default UserPage;