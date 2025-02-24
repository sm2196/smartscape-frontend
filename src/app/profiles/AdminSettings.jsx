import React, { useState, useEffect } from 'react';

const AdminSettings = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [familyMembers, setFamilyMembers] = useState([
    { name: 'Chang', email: 'chang@example.com', lastOnline: '2 hours ago', online: true },
    { name: 'Claire', email: 'claire@example.com', lastOnline: '1 day ago', online: false },
    { name: 'Lovisa', email: 'lovisa@example.com', lastOnline: '30 minutes ago', online: true },
    { name: 'Max', email: 'max@example.com', lastOnline: '5 hours ago', online: false },
    { name: 'Mom', email: 'mom@example.com', lastOnline: '3 days ago', online: true }
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [permissions, setPermissions] = useState({
    electricity: false,
    water: false,
    voltage: false,
    control: false,
  });
  const [selectedMember, setSelectedMember] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const enteredPin = pinDigits.join('');
    if (enteredPin === '1234') {
      setAuthenticated(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid PIN. Please try again.');
      setPinDigits(['', '', '', '']);
    }
  };

  const handlePinChange = (index, value) => {
    const newPinDigits = [...pinDigits];
    newPinDigits[index] = value.replace(/\D/g, '');
    setPinDigits(newPinDigits);

    // Move focus to next input
    if (value && index < 3) {
      document.getElementById(`pin-input-${index + 1}`).focus();
    }
  };

  // PIN Entry Screen
  if (!authenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        backgroundColor: '#F5F7FA'
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#0A1630', marginBottom: '30px' }}>Admin Access Required</h2>
          <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`pin-input-${index}`}
                  type="password"
                  pattern="\d*"
                  inputMode="numeric"
                  maxLength="1"
                  value={pinDigits[index]}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
                      document.getElementById(`pin-input-${index - 1}`).focus();
                    }
                  }}
                  style={{
                    width: '50px',
                    height: '50px',
                    fontSize: '24px',
                    textAlign: 'center',
                    border: '2px solid #0A1630',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <button style={{
              padding: '12px 30px',
              backgroundColor: '#0A1630',
              color: 'white',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              width: 'auto'
            }}>
              Unlock Admin Settings
            </button>
            <div style={{ color: '#ff4444', margin: '15px 0', minHeight: '20px' }}>
              {errorMessage}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Original Admin Settings Functionality
  const handleAddMember = () => {
    if (newMemberName && newMemberEmail) {
      const newMember = {
        name: newMemberName,
        email: newMemberEmail,
        lastOnline: 'Just now',
        online: true
      };
      setFamilyMembers([...familyMembers, newMember]);
      setNewMemberName('');
      setNewMemberEmail('');
    }
  };

  const handleRemoveMember = (name) => {
    const updatedMembers = familyMembers.filter(member => member.name !== name);
    setFamilyMembers(updatedMembers);
  };

  const toggleStatus = (name) => {
    const updatedMembers = familyMembers.map(member =>
      member.name === name ? { ...member, online: !member.online, lastOnline: 'Just now' } : member
    );
    setFamilyMembers(updatedMembers);
  };

  const togglePermission = (perm) => {
    setPermissions((prev) => ({ ...prev, [perm]: !prev[perm] }));
  };

  const styles = {
    container: {
      padding: isMobile ? '10px' : '20px',
      backgroundColor: '#F5F7FA',
      color: '#0A1630',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    navbar: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
      backgroundColor: '#152447',
      padding: isMobile ? '10px' : '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      flexShrink: 0
    },
    logo: {
      width: isMobile ? '40px' : '50px',
      height: isMobile ? '40px' : '50px',
      marginRight: '15px'
    },
    heading: {
      margin: 0,
      color: '#FFFAFA',
      fontSize: isMobile ? '18px' : '24px'
    },
    topSection: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '20px',
      flexShrink: 0
    },
    box: {
      padding: isMobile ? '15px' : '20px',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    actionButton: {
      padding: isMobile ? '8px' : '10px',
      backgroundColor: '#0A1630',
      color: 'white',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontSize: isMobile ? '12px' : '14px',
      width: '100%'
    },
    removeButton: {
      padding: '5px 10px',
      backgroundColor: '#ff4444',
      color: 'white',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontSize: isMobile ? '10px' : '12px'
    },
    input: {
      width: '100%',
      padding: isMobile ? '6px' : '8px',
      marginTop: '10px',
      borderRadius: '5px',
      border: '1px solid #C4C4C4',
      fontSize: '14px'
    },
    statusIndicator: {
      width: '15px',
      height: '15px',
      borderRadius: '50%',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    permissionItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: isMobile ? '8px' : '10px',
      backgroundColor: '#f0f0f0',
      borderRadius: '5px',
      marginBottom: '5px',
      fontSize: isMobile ? '14px' : 'inherit'
    },
    switch: {
      position: 'relative',
      display: 'inline-block',
      width: '40px',
      height: '20px'
    },
    slider: {
      position: 'absolute',
      cursor: 'pointer',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#ccc',
      transition: '0.4s',
      borderRadius: '20px'
    },
    sliderBefore: {
      position: 'absolute',
      content: '""',
      height: '16px',
      width: '16px',
      left: '2px',
      bottom: '2px',
      backgroundColor: 'white',
      transition: '0.4s',
      borderRadius: '50%'
    },
    memberList: {
      marginTop: '10px',
      maxHeight: '200px',
      overflowY: 'auto'
    },
    memberItem: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '10px',
      borderBottom: '1px solid #eee',
      gap: '10px'
    },
    rightColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      overflowY: 'auto',
      paddingBottom: '20px'
    },
    savingsAmount: {
      fontSize: isMobile ? '24px' : '32px',
      fontWeight: 'bold',
      color: '#0A1630',
      margin: '15px 0',
      textAlign: 'center'
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    contentWrapper: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
      gap: '20px',
      flex: 1,
      overflow: 'hidden'
    },
    leftColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      overflowY: 'auto',
      paddingRight: isMobile ? 0 : '20px'
    },
    mobileMemberActions: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: isMobile ? '8px' : 0
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <img src="/path-to-logo.png" alt="Logo" style={styles.logo} />
        <h1 style={styles.heading}>Admin Settings</h1>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.topSection}>
          <div style={{ ...styles.box, backgroundColor: '#D2DCF5' }}>
            <h3>Account License</h3>
            <p>License Number ******678</p>
            <p>Expiry Date 13/02/2025</p>
            <button style={styles.actionButton}>📥 Terms and Conditions</button>
          </div>

          <div style={{ ...styles.box, backgroundColor: '#f0f0f0' }}>
            <h3>House Info</h3>
            <p>Building 22, Flat 9, Barsha building<br/>Green Street, Dubai, UAE</p>
          </div>

          <div style={{ ...styles.box, backgroundColor: '#E6F9ED' }}>
            <h3>Monthly Savings</h3>
            <div style={styles.savingsAmount}>$1,250</div>
            <p style={{ textAlign: 'center', color: '#666' }}>Updated 2 hours ago</p>
          </div>
        </div>

        <div style={styles.contentWrapper}>
          <div style={styles.leftColumn}>
            <div style={styles.box}>
              <h3>Add Family Member</h3>
              <input
                type="text"
                placeholder="Enter full name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                style={styles.input}
              />
              <input
                type="email"
                placeholder="Enter email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                style={styles.input}
              />
              <button style={{ ...styles.actionButton, marginTop: '10px' }} onClick={handleAddMember}>
                Add Member
              </button>

              <div style={styles.memberList}>
                {familyMembers.map((member) => (
                  <div key={member.name} style={styles.memberItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>{member.name}</span>
                    </div>
                    <div style={isMobile ? styles.mobileMemberActions : { display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                        onClick={() => toggleStatus(member.name)}
                      >
                        <span
                          style={{ ...styles.statusIndicator, backgroundColor: member.online ? 'green' : 'red' }}
                        ></span>
                        <span>{member.online ? 'Online' : 'Offline'}</span>
                      </div>
                      <button style={styles.removeButton} onClick={() => handleRemoveMember(member.name)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.box}>
              <h3>Permissions</h3>
              {Object.entries(permissions).map(([perm, value]) => (
                <div key={perm} style={styles.permissionItem}>
                  <span>Allow SmartScape to {perm}</span>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => togglePermission(perm)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      ...styles.slider,
                      backgroundColor: value ? '#0A1630' : '#ccc'
                    }}>
                      <span style={{
                        ...styles.sliderBefore,
                        transform: value ? 'translateX(20px)' : 'none'
                      }}></span>
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={{ ...styles.box, backgroundColor: '#FFF5E6' }}>
              <h3>Verified Documents</h3>
              <div style={styles.memberList}>
                {['Property Ownership', 'ID Verification', 'Utility Bills', 'Insurance Documents', 'Smart Devices Certificates'].map((doc) => (
                  <div key={doc} style={styles.permissionItem}>
                    <span>{doc}</span>
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Verified</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...styles.box, backgroundColor: '#E6F0FF' }}>
              <h3>24/7 Support</h3>
              <p style={{ textAlign: 'center', margin: '15px 0' }}>
                Our dedicated support team is available round the clock
              </p>
              <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', margin: '20px 0' }}>
                📞 800-555-0192
              </div>
              <button style={styles.actionButton}>Contact Support</button>
            </div>
          </div>
        </div>
      </div>

      {selectedMember && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            width: isMobile ? '90%' : '300px',
            textAlign: 'center'
          }}>
            <h3>{selectedMember.name}'s Status</h3>
            <p><strong>Email:</strong> {selectedMember.email}</p>
            <p><strong>Status:</strong> {selectedMember.online ? 'Online' : 'Offline'}</p>
            <p><strong>Last Online:</strong> {selectedMember.lastOnline}</p>
            <button style={styles.actionButton} onClick={() => setSelectedMember(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;