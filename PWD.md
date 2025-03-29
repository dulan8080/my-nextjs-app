# Product Requirements Document (PRD)
## Print Job Card Handling System

### 1. Project Overview
The Print Job Card Handling System is a comprehensive software solution designed to streamline the print shop workflow, from customer interaction to job completion and invoicing.

### 2. System Objectives
- Simplify the print job order process
- Provide a systematic approach to job tracking
- Enable detailed job specification
- Integrate with existing inventory and accounting systems
- Facilitate easy management and status tracking of print jobs

### 3. Functional Requirements

#### 3.1 Customer Interaction and Job Card Creation
- **Customer Registration**
  - Capture comprehensive customer details
  - Option to save customer information for repeat business
  - Collect contact information, billing address, and any special notes

#### 3.2 Job Type Selection
The system shall support multiple job types with specific input requirements:
1. **Digital Print**
2. **Offset Print**
3. **Sublimation**

#### 3.3 Digital Print Specific Requirements
##### 3.3.1 Roll Size Selection
- Ability to select roll width
- Input print size (Width x Height in inches)
- Automatic off-cut calculation
  - Example: 24" roll width, 20"x20" print image results in 4" off-cut
- Manual off-cut adjustment option

##### 3.3.2 Print Finishing Options
- Pole mounting selection
  - Choose pole placement (side selection)
- Laminating options
  - Manual size and off-cut input
- Additional Finishing Options:
  - Space only
  - Pocket only
  - Print and cut
  - Finishing remarks

##### 3.3.3 Pocket Specifications
- Pocket size selection (in inches)
- Detailed pocket configuration options

#### 3.4 Offset and Sublimation Print
- Standard measurement input
- Default calculation methods
- Consistent input interface

#### 3.5 Job Card Submission
- File upload capability for job-related documents
- Automatic notification to print section
- File and job details transmission

#### 3.6 Print Section Workflow
- Dedicated page for job card management
- Status tracking functionality
  - Ability to update job status
  - Real-time status tracking

#### 3.7 Admin Approval Process
- Admin review and price verification
- Job approval mechanism
- Invoice generation control
  - Prevent invoice generation without admin approval

### 4. Settings Management
#### 4.1 Job Type Management
- Add, edit, and delete job types
- Configure job type-specific parameters

#### 4.2 Material Configuration
- Create and manage materials for each job type
- Define material sizes
- Specify material-specific attributes

#### 4.3 Pricing Configuration
- Set pricing for:
  - Printing (per square foot)
  - Off-cuts
  - Job type-specific pricing
- Offset and sublimation pricing management
- Flexible pricing structure

### 5. System Integration
#### 5.1 Inventory System Integration
- Planned future integration with existing inventory system
- Prepare data structures for seamless connection

#### 5.2 Accounting System Integration
- Facilitate invoice generation
- Prepare for future accounting system link

### 6. Technical Requirements
- Web-based application
- Responsive design
- Secure user authentication
- Data persistence
- Scalable architecture

### 7. User Roles
1. **Customer**
   - Job submission
   - Basic information input

2. **Print Section Staff**
   - Job status management
   - Job processing

3. **Admin**
   - Job approval
   - Pricing configuration
   - System settings management

### 8. Non-Functional Requirements
- User-friendly interface
- Fast performance
- Data security
- Backup and recovery mechanisms

### 9. Future Enhancements
- Mobile application
- Advanced reporting
- Customer portal
- Enhanced integration capabilities

### 10. Constraints and Limitations
- Initial version will be standalone
- Gradual integration with existing systems
- Compliance with local print shop regulations

### 11. Acceptance Criteria
- Successful job card creation
- Accurate pricing calculation
- Smooth workflow management
- Admin approval process
- File upload and management

### 12. Open Questions and Assumptions
- Specific hardware requirements
- Exact integration points with existing systems
- Detailed reporting needs

---

**Note:** This PRD serves as a living document and will be updated as the project progresses and more details are clarified.
