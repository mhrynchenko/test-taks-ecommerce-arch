# Online Shop - Test Task

## Instructions

### How to view diagram? 

I have provided a [diagram](shop_test_task.drawio.xml) for this test task. To view the diagram, you need to go to [draw.io](https://app.diagrams.net/) and import the provided XML file.

## Architecture (Task 1)

As there were no non-functional requirements provided, I'll consider some numbers here before making architectural decisions.

### Non-functional requirments

**Performance**

- Response times should be under 2 seconds for 95% of requests during normal operation.
- The system should handle at least 10_000 requests per second during peak load.

**Scalability**

- The system should scale to handle a 200% increase in load within 10 minutes of detecting load increase.

**Reliability**

- RTO should nearly instant or few mins.

**Availability**

- 99.99% uptime.

### Tech Considerations

1. I will be using AWS as a cloud provider.
2. I will use [Serverless JS](https://www.serverless.com/) as the framework, along with a serverless approach to microservice architecture, to reduce DevOps costs.
3. I will use TS as a main language, to enforce best practises.
4. I will use Terraform for IaC (only for core things EventBridge, DB's, roles etc.).

### Solution

Based on the assumptions about NFC made above, I'm going to implement a microservice architecture, as a modular monolithic architecture won't be able to scale enough to meet these requirements.

__**** IMPORTANT ****__

I decided to skip the part of the test task where you ask to create a folder structure for two reasons: it won't represent the architecture well enough, and I'll store each microservice in a separate repository to have an independent CI/CD process for each team. Therefore, it will be difficult to showcase multiple repositories. Instead, I have attached a diagram to this repository.

I have implemented 4 microservices:

#### Product Catalog

It implements the CQRS pattern and uses DynamoDB to optimize write throughput and provide flexible query capabilities. This achieves high write scalability for workloads with well-defined access patterns when adding data. A relational database, such as Aurora, provides complex query functionality. A DynamoDB stream sends data to a Lambda function that updates the Aurora table.

I decided to use AppSync to optimize the service for both mobile and desktop clients.

#### Payments Service

The explanation can be found in section "Implementation of Payments microservice (Task 2)"

#### Delivery Service

Nothing special. :)

#### Notification Service

Is using Fan Out pattern to send notiffication to different channels.

## Implementation of Payments microservice (Task 2)

### Solution

You can find this microservice on the [diagram](shop_test_task.drawio.xml) (please see the instruction section).

The concept behind this implementation is that all payment provider-specific integration details will be concealed within `src/providers/*`.
Each payment provider will have two routes:

1. The first route processes user requests and adds them to DynamoDB in pending status.
2. The second route is a webhook lambda processor. Upon receiving results from the payment provider, it updates DynamoDB with a new status and then sends a message to EventBridge. By utilizing EventBridge rules, we can subsequently route this event to Notification and Delivery Services.

### Project structure

```
src
|-- providers
|   |-- stripe
|   |   |-- adapters
|   |   |-- functions
|   |   |   |-- payment
|   |   |   |-- webhook
|   |   |-- types
|   |-- paypal
|   |-- braintree
|-- types
|-- libs
```

- `src/providers` - stores a list of supported payment providers.
- `src/libs` - stores libs used by all payment providers.
- `src/types` - stores types used by all payment providers.
- `src/providers/stripe/adapters` - stores a list of common adapters for all lambdas inside the payment provider.
- `src/providers/stripe/functions` - stores lambdas.
- `src/providers/stripe/types` - stores types used across the payment provider.
- `src/providers/stripe/functions/payment` - stores a lambda and specific items used by this lambda (types, schema, adapter, etc.). This lambda is used to process user requests and send a payment to a specific payment provider.
- `src/providers/stripe/functions/webhook` - I assume that every payment provider will send processing results to a webhook. Since the data structure of the request will be different for each payment provider we support, each will have its own API Gateway endpoint. This approach will simplify the architecture and eliminate the need for a router lambda.
