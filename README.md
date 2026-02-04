# Currency Exchange Project

## Introduction
This project displays the architecture of a Website that displays the Currency exchange information of the day along with historic values.

## Requirements
This proposal is composed in a highly available infrastructure design in order to achieve the following SLO

#### Customer Expectations
In order to define SLI/SLO's we must understand what are the customer expectations from the service, so the following list serves as a ground base to define the SLI/SLO's:
- The service needs to available in bussiness hours 8am to 8pm UTC-6.
- The service must respond fast at any given time.
- The service must have data accuracy of 99.99%.


### SLIs and SLOs
 Based on the customer expectations the following SLI/SLO table is defined:
| Category      | SLI | SLO
| ------------- | ------- | ------- |
| Availability  |  99.95% uptime measured over last 30 days |  99.95% availability  |
| Latency       |  P95 response time < 2000ms |  95% of requests under 2000ms  |
| Error Rate    |  0.05% failed requests|  99.95% data accuracy  |


## Application overview
The Currency Exchange application is a web-based platform that provides users with real-time currency exchange rates and historical data. The application fetches exchange rate data from a reliable third-party API and displays it in an intuitive user interface. Users can view current exchange rates, compare historical trends, and access detailed information about various currencies including USD.

The application is designed to be highly available and scalable, ensuring that users can access the information they need at any time and to accomplish that all the currency information is stored in a MySQL database, which is updated regularly with the latest exchange rates, this information is collected using AWS Lambda functions triggered by EventBridge, the function uses Banxico public API to fetch the data on a scheduled basis, once the information is collected and stored it can be consulted by the backend service and display at the frontend where it includes most recient data visualization and historical trend analysis to enhance the user experience.

#### Frontend
- Built with React.js to provide a dynamic and responsive user interface.
- Communicates with the backend API to fetch and display currency exchange data.
- **External Elastic Load Balancer (ELB)**: Distributes incoming traffic from the DNS A record across multiple EC2 instances to ensure high availability and fault tolerance.
- **EC2 Instances**: Hosts the Currency Exchange application, running the frontend services.

#### Backend
- Developed using Node.js and Express.js to handle API requests and data processing.
- Connects to the MySQL database to retrieve and store currency exchange data.
- **External Elastic Load Balancer (ELB)**: Distributes incoming API requests from the frontend to multiple backend EC2 instances to ensure high availability and fault tolerance.
- **Auto Scaling Group**: Automatically adjusts the number of EC2 instances based on traffic demand to maintain performance and cost-efficiency.
- **EC2 Instances**: Hosts the Currency Exchange application, running the backend services.

#### Database
- **MySQL database** hosted on Amazon RDS to store historical currency exchange data.
- Regularly updated with the latest exchange rates fetched from the Banxico API.

### Data Collection
- **AWS Lambda Function**: A serverless function that runs on a schedule to fetch the latest currency exchange rates from the Banxico API.
- **Amazon EventBridge**: Schedules the Lambda function to run at specified intervals, ensuring that the database is regularly updated with fresh data.

## Architecture 
The Currency Exchange application is built using modern web technologies and follows best practices for performance and security. The frontend is developed using React.js, providing a responsive and interactive user interface. The backend is powered by Node.js and Express.js, handling API requests and data processing. The application uses a MySQL database to store historical exchange rate data, ensuring data integrity and reliability.

| Component        | Technology/Service |
|------------------|--------------------|
| Frontend         | React.js           |
| Backend          | Node.js, Express.js|
| Database         | MySQL              |
| Hosting          | AWS EC2            |
| Load Balancer    | AWS ELB            |
| Third-Party API  | Banxico            |
| Monitoring       | AWS CloudWatch     |
| Region           | us-east-1          |
| Data collection  | Lambda function    |
| Scheduling       | Eventbridge        |

### High Availability and Scalability
- The application is deployed across multiple Availability Zones (AZs) within the AWS us-east-1 region to ensure high availability.
- Auto Scaling Groups are configured for the backend EC2 instances to automatically adjust capacity based on traffic demand.
- The MySQL database is set up with Multi-AZ deployment for enhanced availability and failover support.
### Monitoring and Logging
- AWS CloudWatch is used to monitor application performance, log errors, and set up alarms for critical metrics.

### Diagram
![Architecture Diagram](docs/architecture.drawio.png)



### Security Considerations:
- All data in transit is encrypted using TLS.
- IAM roles and policies are defined with the principle of least privilege. 
- All plain HTTP traffic is redirected to HTTPS.
- Security groups are configured to allow only necessary traffic.