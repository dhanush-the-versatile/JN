// JatayuNetra Tourist Safety System
class JatayuNetraApp {
  constructor() {
    this.currentUser = null;
    this.currentView = 'login';
    this.registrationStep = 1;
    this.sosTimer = null;
    this.sosCountdown = 50;
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.initData();
    this.setTheme(this.theme);
    this.render();
    this.setupEventListeners();
  }

  initData() {
    // Initialize sample data in localStorage if not exists
    if (!localStorage.getItem('users')) {
      const sampleData = {
        "tourists": [
          {
            "username": "john_doe",
            "password": "Password123!",
            "firstName": "John",
            "lastName": "Doe",
            "userType": "Tourist",
            "digitalId": "JN-2024-001234",
            "kycStatus": "Verified",
            "idType": "Aadhaar",
            "idNumber": "1234-5678-9012",
            "emergencyContacts": [
              {"name": "Jane Doe", "phone": "+91-9876543210", "relationship": "Spouse"},
              {"name": "Medical Center", "phone": "+91-1234567890", "relationship": "Hospital"}
            ],
            "currentTrip": {
              "destination": "Goa",
              "startDate": "2024-12-01",
              "endDate": "2024-12-07",
              "status": "Active"
            },
            "location": {"lat": 15.2993, "lng": 74.1240}
          }
        ],
        "authorities": [
          {
            "username": "police_goa",
            "password": "Police123!",
            "name": "Goa Police Control Room",
            "userType": "Police",
            "jurisdiction": "Goa State",
            "badgeNumber": "GP-2024-001"
          },
          {
            "username": "tourism_goa", 
            "password": "Tourism123!",
            "name": "Goa Tourism Officer",
            "userType": "Tourism",
            "department": "Goa Tourism Development Corporation"
          },
          {
            "username": "hospital_admin",
            "password": "Hospital123!",
            "name": "District Hospital Admin",
            "userType": "Hospital",
            "facility": "Goa Medical College & Hospital"
          },
          {
            "username": "gov_admin",
            "password": "Government123!",
            "name": "State Administrator",
            "userType": "Government",
            "level": "State Government"
          }
        ]
      };
      localStorage.setItem('users', JSON.stringify(sampleData));
    }

    if (!localStorage.getItem('emergencyData')) {
      const emergencyData = {
        "activeAlerts": [
          {
            "alertId": "SOS-2024-001",
            "touristId": "JN-2024-001234",
            "touristName": "John Doe",
            "timestamp": new Date().toISOString(),
            "location": {"lat": 15.2993, "lng": 74.1240, "address": "Baga Beach, Goa"},
            "status": "Active",
            "type": "SOS Alert",
            "responseTime": "2 minutes ago"
          }
        ]
      };
      localStorage.setItem('emergencyData', JSON.stringify(emergencyData));
    }
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-color-scheme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  render() {
    const appRoot = document.getElementById('app-root');
    
    switch (this.currentView) {
      case 'login':
        appRoot.innerHTML = this.renderLogin();
        break;
      case 'register':
        appRoot.innerHTML = this.renderRegistration();
        break;
      case 'tourist-dashboard':
        appRoot.innerHTML = this.renderTouristDashboard();
        break;
      case 'police-dashboard':
        appRoot.innerHTML = this.renderPoliceDashboard();
        break;
      case 'tourism-dashboard':
        appRoot.innerHTML = this.renderTourismDashboard();
        break;
      case 'hospital-dashboard':
        appRoot.innerHTML = this.renderHospitalDashboard();
        break;
      case 'government-dashboard':
        appRoot.innerHTML = this.renderGovernmentDashboard();
        break;
      default:
        appRoot.innerHTML = this.renderLogin();
    }

    this.setupViewEventListeners();
  }

  renderLogin() {
    return `
      ${this.renderThemeToggle()}
      <div class="login-container">
        <form class="login-form" id="login-form">
          <div class="login-header">
            <div class="logo">
              <svg viewBox="0 0 64 64">
                <ellipse cx="32" cy="32" rx="30" ry="30" fill="#1FB8CD"/>
                <path d="M32 56C46 56 56 36 32 10 8 36 18 56 32 56z" fill="#DB4545"/>
                <ellipse cx="32" cy="34" rx="6" ry="6" fill="#fff"/>
                <ellipse cx="32" cy="34" rx="3" ry="3" fill="#13443B"/>
              </svg>
              JatayuNetra
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to access your safety dashboard</p>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="username">Username</label>
            <input type="text" id="username" class="form-control" required>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input type="password" id="password" class="form-control" required>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="userType">User Type</label>
            <select id="userType" class="form-control" required>
              <option value="">Select User Type</option>
              <option value="Tourist">Tourist</option>
              <option value="Police">Police</option>
              <option value="Tourism">Tourism Department</option>
              <option value="Hospital">Hospital</option>
              <option value="Government">Government</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn--primary">Login</button>
            <button type="button" class="btn btn--secondary" id="register-btn">Register as Tourist</button>
          </div>
        </form>
      </div>
    `;
  }

  renderRegistration() {
    if (this.registrationStep === 1) {
      return this.renderRegistrationStep1();
    } else {
      return this.renderRegistrationStep2();
    }
  }

  renderRegistrationStep1() {
    return `
      ${this.renderThemeToggle()}
      <div class="registration-container">
        <form class="registration-form" id="registration-form">
          <div class="step-indicator">
            <div class="step active">
              <span class="step-number">1</span>
              <span>Account Creation</span>
            </div>
            <div class="step inactive">
              <span class="step-number">2</span>
              <span>KYC Verification</span>
            </div>
          </div>
          
          <h2 class="text-center mb-16">Create Tourist Account</h2>
          
          <div class="form-group">
            <label class="form-label" for="firstName">First Name</label>
            <input type="text" id="firstName" class="form-control" required>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="lastName">Last Name</label>
            <input type="text" id="lastName" class="form-control" required>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="regUsername">Username</label>
            <input type="text" id="regUsername" class="form-control" required>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="regPassword">Password</label>
            <input type="password" id="regPassword" class="form-control" required>
            <div class="password-requirements">
              <div class="requirement" id="req-length">
                <span>• At least 8 characters</span>
              </div>
              <div class="requirement" id="req-uppercase">
                <span>• One uppercase letter</span>
              </div>
              <div class="requirement" id="req-number">
                <span>• One number</span>
              </div>
              <div class="requirement" id="req-special">
                <span>• One special character</span>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn--secondary" id="back-to-login">Back to Login</button>
            <button type="submit" class="btn btn--primary">Next Step</button>
          </div>
        </form>
      </div>
    `;
  }

  renderRegistrationStep2() {
    return `
      ${this.renderThemeToggle()}
      <div class="registration-container">
        <form class="registration-form" id="kyc-form">
          <div class="step-indicator">
            <div class="step completed">
              <span class="step-number">✓</span>
              <span>Account Creation</span>
            </div>
            <div class="step active">
              <span class="step-number">2</span>
              <span>KYC Verification</span>
            </div>
          </div>
          
          <h2 class="text-center mb-16">KYC Verification</h2>
          
          <div class="kyc-section">
            <label class="form-label">Residence Status</label>
            <div class="kyc-options">
              <div class="kyc-option" data-type="indian">
                <input type="radio" name="residence" value="indian" id="indian">
                <label for="indian">
                  <strong>Indian Resident</strong><br>
                  <small>Verify with Aadhaar Card</small>
                </label>
              </div>
              <div class="kyc-option" data-type="foreign">
                <input type="radio" name="residence" value="foreign" id="foreign">
                <label for="foreign">
                  <strong>NRI/Foreigner</strong><br>
                  <small>Verify with Passport</small>
                </label>
              </div>
            </div>
          </div>
          
          <div class="form-group" id="id-number-group" style="display: none;">
            <label class="form-label" id="id-label">ID Number</label>
            <input type="text" id="idNumber" class="form-control">
          </div>
          
          <div class="file-upload" id="file-upload" style="display: none;">
            <label class="form-label" id="file-label">Upload Document</label>
            <div class="file-input-wrapper">
              <input type="file" id="documentFile" class="file-input" accept="image/*,.pdf">
              <label for="documentFile" class="file-input-label">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <span id="file-text">Click to upload or drag and drop</span>
              </label>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn--secondary" id="back-step">Previous Step</button>
            <button type="submit" class="btn btn--primary" disabled id="complete-registration">Complete Registration</button>
          </div>
        </form>
      </div>
    `;
  }

  renderTouristDashboard() {
    const user = this.currentUser;
    return `
      ${this.renderThemeToggle()}
      <div class="dashboard-container">
        <div class="dashboard-header">
          <div class="dashboard-title">
            <div>
              <h1>Tourist Dashboard</h1>
              <p class="text-secondary">Welcome back, ${user.firstName} ${user.lastName}</p>
            </div>
            <div class="user-info">
              <div class="user-avatar">${user.firstName[0]}${user.lastName[0]}</div>
              <div>
                <div class="font-medium">${user.firstName} ${user.lastName}</div>
                <div class="text-sm text-secondary">ID: ${user.digitalId}</div>
              </div>
              <button class="btn btn--secondary" id="logout-btn">Logout</button>
            </div>
          </div>
        </div>
        
        <div class="dashboard-content">
          <div class="sos-container">
            <button class="sos-button" id="sos-button">
              <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M15.5,8A1.5,1.5 0 0,1 17,9.5A1.5,1.5 0 0,1 15.5,11A1.5,1.5 0 0,1 14,9.5A1.5,1.5 0 0,1 15.5,8M10,17L8.5,15.5L10,14L8.5,12.5L10,11L8.5,9.5L10,8L8.5,6.5L10,5L8.5,3.5L10,2L8.5,0.5L10,-1"/>
              </svg>
              EMERGENCY
              <div class="text-sm">SOS</div>
            </button>
          </div>
          
          <div class="tourist-features">
            <div class="feature-card" data-feature="vehicle">
              <div class="feature-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92,6.01C18.72,5.42 18.16,5 17.5,5H15V4A1,1 0 0,0 14,3H10A1,1 0 0,0 9,4V5H6.5C5.84,5 5.28,5.42 5.08,6.01L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6.01M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M7,7H17L18.5,11H5.5L7,7Z"/>
                </svg>
              </div>
              <h3 class="feature-title">Vehicle Assistance</h3>
              <p class="feature-description">Find fuel stations, repair shops, and roadside assistance</p>
            </div>
            
            <div class="feature-card" data-feature="medical">
              <div class="feature-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,7V11H7V13H11V17H13V13H17V11H13V7H11Z"/>
                </svg>
              </div>
              <h3 class="feature-title">Medical Assistance</h3>
              <p class="feature-description">Emergency medical help and nearby hospitals</p>
            </div>
            
            <div class="feature-card" data-feature="police">
              <div class="feature-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M11,7H13V13H11V7M11,15H13V17H11V15Z"/>
                </svg>
              </div>
              <h3 class="feature-title">Police Assistance</h3>
              <p class="feature-description">Find police stations and report incidents</p>
            </div>
            
            <div class="feature-card" data-feature="contacts">
              <div class="feature-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M15.5,8A1.5,1.5 0 0,1 17,9.5A1.5,1.5 0 0,1 15.5,11A1.5,1.5 0 0,1 14,9.5A1.5,1.5 0 0,1 15.5,8M10,17L8.5,15.5L10,14L8.5,12.5L10,11L8.5,9.5L10,8L8.5,6.5L10,5L8.5,3.5L10,2L8.5,0.5L10,-1"/>
                </svg>
              </div>
              <h3 class="feature-title">Emergency Contacts</h3>
              <p class="feature-description">Manage your emergency contact numbers</p>
            </div>
            
            <div class="feature-card" data-feature="trip">
              <div class="feature-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15,19L9,16.89V5L15,7.11M20.5,3C20.44,3 20.39,3 20.34,3L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21C3.55,21 3.61,21 3.66,21L9,18.9L15,21L20.64,19.1C20.85,19.03 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3Z"/>
                </svg>
              </div>
              <h3 class="feature-title">Plan New Trip</h3>
              <p class="feature-description">Set travel itinerary and safety checkpoints</p>
            </div>
            
            <div class="feature-card" data-feature="profile">
              <div class="feature-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                </svg>
              </div>
              <h3 class="feature-title">Profile</h3>
              <p class="feature-description">Manage your account and settings</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal hidden" id="sos-modal">
        <div class="modal-content">
          <h2 class="text-center">Emergency Alert Activated</h2>
          <div class="timer-circle">
            <div class="sos-timer" id="sos-countdown">50</div>
          </div>
          <p class="text-center">Are you safe? This will automatically alert authorities in <span id="countdown-text">50</span> seconds.</p>
          <div class="modal-actions">
            <button class="btn btn--success" id="sos-safe">Yes, I'm Safe</button>
            <button class="btn btn--error" id="sos-emergency">No, Emergency!</button>
          </div>
        </div>
      </div>
      
      <div class="modal hidden" id="emergency-modal">
        <div class="modal-content">
          <h2 class="text-center text-error">Emergency Activated!</h2>
          <p class="text-center">Emergency services have been notified. Help is on the way.</p>
          <div class="emergency-actions">
            <div class="emergency-action">
              <svg class="action-icon" viewBox="0 0 24 24">
                <path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z"/>
              </svg>
              <div class="action-text">
                <strong>GPS Location Shared</strong><br>
                <small>Your exact location has been shared with authorities</small>
              </div>
              <span class="action-status">Active</span>
            </div>
            <div class="emergency-action">
              <svg class="action-icon" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M15.5,8A1.5,1.5 0 0,1 17,9.5A1.5,1.5 0 0,1 15.5,11A1.5,1.5 0 0,1 14,9.5A1.5,1.5 0 0,1 15.5,8M10,17L8.5,15.5L10,14L8.5,12.5L10,11L8.5,9.5L10,8L8.5,6.5L10,5L8.5,3.5L10,2L8.5,0.5L10,-1"/>
              </svg>
              <div class="action-text">
                <strong>Emergency Contacts Notified</strong><br>
                <small>SMS alerts sent to your emergency contacts</small>
              </div>
              <span class="action-status">Sent</span>
            </div>
            <div class="emergency-action">
              <svg class="action-icon" viewBox="0 0 24 24">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M11,7H13V13H11V7M11,15H13V17H11V15Z"/>
              </svg>
              <div class="action-text">
                <strong>Authorities Alerted</strong><br>
                <small>Police and medical services have been notified</small>
              </div>
              <span class="action-status">Dispatched</span>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn--primary w-full" id="close-emergency">Close</button>
          </div>
        </div>
      </div>
    `;
  }

  renderPoliceDashboard() {
    const user = this.currentUser;
    const emergencyData = JSON.parse(localStorage.getItem('emergencyData'));
    
    return `
      ${this.renderThemeToggle()}
      <div class="dashboard-container">
        <div class="dashboard-header">
          <div class="dashboard-title">
            <div>
              <h1>Police Dashboard</h1>
              <p class="text-secondary">${user.name} - ${user.jurisdiction}</p>
            </div>
            <div class="user-info">
              <div class="user-avatar">P</div>
              <div>
                <div class="font-medium">${user.name}</div>
                <div class="text-sm text-secondary">Badge: ${user.badgeNumber}</div>
              </div>
              <button class="btn btn--secondary" id="logout-btn">Logout</button>
            </div>
          </div>
        </div>
        
        <div class="dashboard-content">
          <div class="authority-dashboard">
            <div class="main-panel">
              <div class="panel-header">Live Tourist Tracking Map</div>
              <div class="panel-content">
                <div style="height: 400px; background: var(--color-bg-1); border-radius: var(--radius-base); display: flex; align-items: center; justify-content: center; border: 2px dashed var(--color-border);">
                  <div class="text-center">
                    <svg width="48" height="48" fill="var(--color-text-secondary)" viewBox="0 0 24 24">
                      <path d="M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5Z"/>
                    </svg>
                    <p class="text-secondary">Interactive map showing real-time tourist locations</p>
                    <div class="status status--success">2 Active Tourists</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="side-panel">
              <div class="card">
                <div class="panel-header">Active SOS Alerts</div>
                <div class="panel-content">
                  ${emergencyData.activeAlerts.map(alert => `
                    <div class="emergency-action" style="margin-bottom: var(--space-12);">
                      <svg class="action-icon" viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M15.5,8A1.5,1.5 0 0,1 17,9.5A1.5,1.5 0 0,1 15.5,11A1.5,1.5 0 0,1 14,9.5A1.5,1.5 0 0,1 15.5,8M10,17L8.5,15.5L10,14L8.5,12.5L10,11L8.5,9.5L10,8L8.5,6.5L10,5L8.5,3.5L10,2L8.5,0.5L10,-1"/>
                      </svg>
                      <div class="action-text">
                        <strong>${alert.touristName}</strong><br>
                        <small>${alert.location.address}</small><br>
                        <small class="text-error">${alert.responseTime}</small>
                      </div>
                      <span class="action-status" style="background: var(--color-error);">SOS</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <div class="card">
                <div class="panel-header">Quick Actions</div>
                <div class="panel-content">
                  <button class="btn btn--primary w-full mb-8">Generate E-FIR</button>
                  <button class="btn btn--secondary w-full mb-8">Tourist Search</button>
                  <button class="btn btn--outline w-full">Send Alert</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderTourismDashboard() {
    const user = this.currentUser;
    
    return `
      ${this.renderThemeToggle()}
      <div class="dashboard-container">
        <div class="dashboard-header">
          <div class="dashboard-title">
            <div>
              <h1>Tourism Dashboard</h1>
              <p class="text-secondary">${user.name} - ${user.department}</p>
            </div>
            <div class="user-info">
              <div class="user-avatar">T</div>
              <div>
                <div class="font-medium">${user.name}</div>
                <div class="text-sm text-secondary">Tourism Officer</div>
              </div>
              <button class="btn btn--secondary" id="logout-btn">Logout</button>
            </div>
          </div>
        </div>
        
        <div class="dashboard-content">
          <div class="authority-dashboard">
            <div class="main-panel">
              <div class="panel-header">Tourist Heat Map & Analytics</div>
              <div class="panel-content">
                <div style="height: 400px; background: var(--color-bg-3); border-radius: var(--radius-base); display: flex; align-items: center; justify-content: center; border: 2px dashed var(--color-border);">
                  <div class="text-center">
                    <svg width="48" height="48" fill="var(--color-text-secondary)" viewBox="0 0 24 24">
                      <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M13,13V7H11V10H7V12H11V16H13V12H17V10H13Z"/>
                    </svg>
                    <p class="text-secondary">Heat map showing tourist concentrations and popular routes</p>
                    <div class="status status--info">Real-time Analytics</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="side-panel">
              <div class="card">
                <div class="panel-header">Tourist Statistics</div>
                <div class="panel-content">
                  <div style="display: grid; gap: var(--space-12);">
                    <div class="text-center p-0">
                      <div class="font-bold text-xl text-primary">142</div>
                      <div class="text-sm text-secondary">Active Tourists</div>
                    </div>
                    <div class="text-center p-0">
                      <div class="font-bold text-xl text-success">98%</div>
                      <div class="text-sm text-secondary">Safety Score</div>
                    </div>
                    <div class="text-center p-0">
                      <div class="font-bold text-xl text-warning">5</div>
                      <div class="text-sm text-secondary">Active Alerts</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card">
                <div class="panel-header">Resource Management</div>
                <div class="panel-content">
                  <button class="btn btn--primary w-full mb-8">Optimize Routes</button>
                  <button class="btn btn--secondary w-full mb-8">Deploy Resources</button>
                  <button class="btn btn--outline w-full">Send Advisories</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderHospitalDashboard() {
    const user = this.currentUser;
    
    return `
      ${this.renderThemeToggle()}
      <div class="dashboard-container">
        <div class="dashboard-header">
          <div class="dashboard-title">
            <div>
              <h1>Hospital Dashboard</h1>
              <p class="text-secondary">${user.name} - ${user.facility}</p>
            </div>
            <div class="user-info">
              <div class="user-avatar">H</div>
              <div>
                <div class="font-medium">${user.name}</div>
                <div class="text-sm text-secondary">Hospital Admin</div>
              </div>
              <button class="btn btn--secondary" id="logout-btn">Logout</button>
            </div>
          </div>
        </div>
        
        <div class="dashboard-content">
          <div class="authority-dashboard">
            <div class="main-panel">
              <div class="panel-header">Emergency Response Center</div>
              <div class="panel-content">
                <div style="height: 400px; background: var(--color-bg-4); border-radius: var(--radius-base); display: flex; align-items: center; justify-content: center; border: 2px dashed var(--color-border);">
                  <div class="text-center">
                    <svg width="48" height="48" fill="var(--color-text-secondary)" viewBox="0 0 24 24">
                      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,7V11H7V13H11V17H13V13H17V11H13V7H11Z"/>
                    </svg>
                    <p class="text-secondary">Real-time emergency intake and patient management system</p>
                    <div class="status status--warning">2 Incoming</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="side-panel">
              <div class="card">
                <div class="panel-header">Emergency Queue</div>
                <div class="panel-content">
                  <div class="emergency-action">
                    <svg class="action-icon" viewBox="0 0 24 24">
                      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,7V11H7V13H11V17H13V13H17V11H13V7H11Z"/>
                    </svg>
                    <div class="action-text">
                      <strong>Tourist Medical Alert</strong><br>
                      <small>ETA: 8 minutes</small><br>
                      <small class="text-warning">Priority: High</small>
                    </div>
                    <span class="action-status" style="background: var(--color-warning);">Incoming</span>
                  </div>
                </div>
              </div>
              
              <div class="card">
                <div class="panel-header">Quick Actions</div>
                <div class="panel-content">
                  <button class="btn btn--primary w-full mb-8">Prepare Emergency Room</button>
                  <button class="btn btn--secondary w-full mb-8">Contact Ambulance</button>
                  <button class="btn btn--outline w-full">Update Status</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderGovernmentDashboard() {
    const user = this.currentUser;
    
    return `
      ${this.renderThemeToggle()}
      <div class="dashboard-container">
        <div class="dashboard-header">
          <div class="dashboard-title">
            <div>
              <h1>Government Dashboard</h1>
              <p class="text-secondary">${user.name} - ${user.level}</p>
            </div>
            <div class="user-info">
              <div class="user-avatar">G</div>
              <div>
                <div class="font-medium">${user.name}</div>
                <div class="text-sm text-secondary">State Administrator</div>
              </div>
              <button class="btn btn--secondary" id="logout-btn">Logout</button>
            </div>
          </div>
        </div>
        
        <div class="dashboard-content">
          <div class="authority-dashboard">
            <div class="main-panel">
              <div class="panel-header">System Overview & Analytics</div>
              <div class="panel-content">
                <div style="height: 400px; background: var(--color-bg-5); border-radius: var(--radius-base); display: flex; align-items: center; justify-content: center; border: 2px dashed var(--color-border);">
                  <div class="text-center">
                    <svg width="48" height="48" fill="var(--color-text-secondary)" viewBox="0 0 24 24">
                      <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M13,13V7H11V10H7V12H11V16H13V12H17V10H13Z"/>
                    </svg>
                    <p class="text-secondary">Comprehensive system analytics and real-time monitoring</p>
                    <div class="status status--success">All Systems Operational</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="side-panel">
              <div class="card">
                <div class="panel-header">System Status</div>
                <div class="panel-content">
                  <div style="display: grid; gap: var(--space-8);">
                    <div class="flex justify-between items-center">
                      <span class="text-sm">Police Units</span>
                      <span class="status status--success">Online</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-sm">Hospitals</span>
                      <span class="status status--success">Ready</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-sm">Tourism Dept</span>
                      <span class="status status--success">Active</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-sm">Active Tourists</span>
                      <span class="font-bold text-primary">142</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card">
                <div class="panel-header">Digital ID Search</div>
                <div class="panel-content">
                  <div class="form-group">
                    <input type="text" class="form-control" placeholder="Enter Digital ID..." style="margin-bottom: var(--space-8);">
                    <button class="btn btn--primary w-full">Search Tourist</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderThemeToggle() {
    const isDark = this.theme === 'dark';
    return `
      <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
        ${isDark ? 
          '<svg viewBox="0 0 24 24"><path d="M12,18V6A6,6 0 0,1 18,12A6,6 0 0,1 12,18Z"/></svg>' :
          '<svg viewBox="0 0 24 24"><path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.4 6.35,17.41C9.37,20.43 14,20.54 17.33,17.97Z"/></svg>'
        }
      </button>
    `;
  }

  setupEventListeners() {
    // Theme toggle
    document.addEventListener('click', (e) => {
      if (e.target.closest('#theme-toggle')) {
        this.toggleTheme();
      }
    });
  }

  setupViewEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // Registration button
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
      registerBtn.addEventListener('click', () => {
        this.currentView = 'register';
        this.registrationStep = 1;
        this.render();
      });
    }

    // Registration Step 1
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
      registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegistrationStep1();
      });

      // Password validation
      const passwordInput = document.getElementById('regPassword');
      if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
          this.validatePassword(e.target.value);
        });
      }

      // Back to login
      const backToLogin = document.getElementById('back-to-login');
      if (backToLogin) {
        backToLogin.addEventListener('click', () => {
          this.currentView = 'login';
          this.render();
        });
      }
    }

    // KYC form
    const kycForm = document.getElementById('kyc-form');
    if (kycForm) {
      // Residence type selection
      document.querySelectorAll('.kyc-option').forEach(option => {
        option.addEventListener('click', () => {
          document.querySelectorAll('.kyc-option').forEach(opt => opt.classList.remove('selected'));
          option.classList.add('selected');
          const radio = option.querySelector('input[type="radio"]');
          radio.checked = true;
          this.handleResidenceSelection(radio.value);
        });
      });

      // File upload
      const fileInput = document.getElementById('documentFile');
      if (fileInput) {
        fileInput.addEventListener('change', this.handleFileUpload.bind(this));
      }

      // Form submission
      kycForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegistrationComplete();
      });

      // Back step
      const backStep = document.getElementById('back-step');
      if (backStep) {
        backStep.addEventListener('click', () => {
          this.registrationStep = 1;
          this.render();
        });
      }
    }

    // SOS button
    const sosButton = document.getElementById('sos-button');
    if (sosButton) {
      sosButton.addEventListener('click', this.activateSOS.bind(this));
    }

    // SOS modal buttons
    const sosSafe = document.getElementById('sos-safe');
    const sosEmergency = document.getElementById('sos-emergency');
    if (sosSafe) {
      sosSafe.addEventListener('click', this.cancelSOS.bind(this));
    }
    if (sosEmergency) {
      sosEmergency.addEventListener('click', this.confirmEmergency.bind(this));
    }

    // Close emergency modal
    const closeEmergency = document.getElementById('close-emergency');
    if (closeEmergency) {
      closeEmergency.addEventListener('click', () => {
        document.getElementById('emergency-modal').classList.add('hidden');
      });
    }

    // Feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('click', () => {
        const feature = card.dataset.feature;
        this.showToast(`${feature.charAt(0).toUpperCase() + feature.slice(1)} feature coming soon!`, 'info');
      });
    });

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', this.logout.bind(this));
    }
  }

  handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;

    const users = JSON.parse(localStorage.getItem('users'));
    let user = null;

    // Check tourists
    user = users.tourists.find(u => 
      u.username === username && 
      u.password === password && 
      u.userType === userType
    );

    // Check authorities
    if (!user) {
      user = users.authorities.find(u => 
        u.username === username && 
        u.password === password && 
        u.userType === userType
      );
    }

    if (user) {
      this.currentUser = user;
      
      switch (userType) {
        case 'Tourist':
          this.currentView = 'tourist-dashboard';
          break;
        case 'Police':
          this.currentView = 'police-dashboard';
          break;
        case 'Tourism':
          this.currentView = 'tourism-dashboard';
          break;
        case 'Hospital':
          this.currentView = 'hospital-dashboard';
          break;
        case 'Government':
          this.currentView = 'government-dashboard';
          break;
      }
      
      this.render();
      this.showToast(`Welcome back, ${user.firstName || user.name}!`, 'success');
    } else {
      this.showToast('Invalid credentials. Please try again.', 'error');
    }
  }

  validatePassword(password) {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    Object.keys(requirements).forEach(req => {
      const element = document.getElementById(`req-${req}`);
      if (element) {
        element.classList.toggle('valid', requirements[req]);
        element.classList.toggle('invalid', !requirements[req]);
      }
    });

    return Object.values(requirements).every(req => req);
  }

  handleRegistrationStep1() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    if (!this.validatePassword(password)) {
      this.showToast('Please meet all password requirements', 'error');
      return;
    }

    // Check if username exists
    const users = JSON.parse(localStorage.getItem('users'));
    const userExists = users.tourists.some(u => u.username === username) ||
                     users.authorities.some(u => u.username === username);

    if (userExists) {
      this.showToast('Username already exists', 'error');
      return;
    }

    // Store registration data temporarily
    this.registrationData = { firstName, lastName, username, password };
    this.registrationStep = 2;
    this.render();
  }

  handleResidenceSelection(type) {
    const idGroup = document.getElementById('id-number-group');
    const fileUpload = document.getElementById('file-upload');
    const idLabel = document.getElementById('id-label');
    const fileLabel = document.getElementById('file-label');
    const completeBtn = document.getElementById('complete-registration');

    if (type === 'indian') {
      idLabel.textContent = 'Aadhaar Number';
      fileLabel.textContent = 'Upload Aadhaar Card';
      document.getElementById('idNumber').placeholder = 'Enter 12-digit Aadhaar number';
    } else {
      idLabel.textContent = 'Passport Number';
      fileLabel.textContent = 'Upload Passport';
      document.getElementById('idNumber').placeholder = 'Enter passport number';
    }

    idGroup.style.display = 'block';
    fileUpload.style.display = 'block';
    this.checkKYCCompletion();
  }

  handleFileUpload(e) {
    const file = e.target.files[0];
    const fileText = document.getElementById('file-text');
    const label = document.querySelector('.file-input-label');

    if (file) {
      fileText.textContent = file.name;
      label.classList.add('file-selected');
    } else {
      fileText.textContent = 'Click to upload or drag and drop';
      label.classList.remove('file-selected');
    }

    this.checkKYCCompletion();
  }

  checkKYCCompletion() {
    const residence = document.querySelector('input[name="residence"]:checked');
    const idNumber = document.getElementById('idNumber').value;
    const file = document.getElementById('documentFile').files[0];
    const completeBtn = document.getElementById('complete-registration');

    if (residence && idNumber && file) {
      completeBtn.disabled = false;
    } else {
      completeBtn.disabled = true;
    }
  }

  handleRegistrationComplete() {
    const residence = document.querySelector('input[name="residence"]:checked').value;
    const idNumber = document.getElementById('idNumber').value;

    // Generate unique digital ID
    const digitalId = `JN-2024-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;

    // Create new tourist user
    const newUser = {
      ...this.registrationData,
      userType: 'Tourist',
      digitalId,
      kycStatus: 'Verified',
      idType: residence === 'indian' ? 'Aadhaar' : 'Passport',
      idNumber,
      emergencyContacts: [],
      currentTrip: null,
      location: { lat: 0, lng: 0 }
    };

    // Save to localStorage
    const users = JSON.parse(localStorage.getItem('users'));
    users.tourists.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    this.showToast('Registration completed successfully!', 'success');
    this.currentView = 'login';
    this.render();
  }

  activateSOS() {
    const modal = document.getElementById('sos-modal');
    modal.classList.remove('hidden');
    
    this.sosCountdown = 50;
    this.updateSOSTimer();
    
    this.sosTimer = setInterval(() => {
      this.sosCountdown--;
      this.updateSOSTimer();
      
      if (this.sosCountdown <= 0) {
        clearInterval(this.sosTimer);
        this.confirmEmergency();
      }
    }, 1000);
  }

  updateSOSTimer() {
    const timerElement = document.getElementById('sos-countdown');
    const textElement = document.getElementById('countdown-text');
    
    if (timerElement) timerElement.textContent = this.sosCountdown;
    if (textElement) textElement.textContent = this.sosCountdown;
  }

  cancelSOS() {
    clearInterval(this.sosTimer);
    document.getElementById('sos-modal').classList.add('hidden');
    this.showToast('SOS cancelled. Stay safe!', 'success');
  }

  confirmEmergency() {
    clearInterval(this.sosTimer);
    document.getElementById('sos-modal').classList.add('hidden');
    
    // Create emergency alert
    const emergencyData = JSON.parse(localStorage.getItem('emergencyData'));
    const newAlert = {
      alertId: `SOS-2024-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
      touristId: this.currentUser.digitalId,
      touristName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
      timestamp: new Date().toISOString(),
      location: { lat: 15.2993, lng: 74.1240, address: "Current Location" },
      status: 'Active',
      type: 'SOS Alert',
      responseTime: 'Just now'
    };
    
    emergencyData.activeAlerts.unshift(newAlert);
    localStorage.setItem('emergencyData', JSON.stringify(emergencyData));
    
    // Show emergency modal
    document.getElementById('emergency-modal').classList.remove('hidden');
    this.showToast('Emergency services have been notified!', 'error');
  }

  logout() {
    this.currentUser = null;
    this.currentView = 'login';
    this.render();
    this.showToast('Logged out successfully', 'info');
  }

  showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,7V13H13V7H11M11,15V17H13V15H11Z"/>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.jatayuApp = new JatayuNetraApp();
});

// Add event listeners for ID number and file input changes in KYC
document.addEventListener('input', (e) => {
  if (e.target.id === 'idNumber' && window.jatayuApp) {
    window.jatayuApp.checkKYCCompletion();
  }
});