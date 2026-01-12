# Backend endpoints

## Auth Endpoints

### POST /auth/register/

Creates user account.

#### Request Body
##### Content-Type: application/json
##### Schema
| Field          | Type   | Required | Constraints / Description                               |
| -------------- | ------ | -------- | ------------------------------------------------------- |
| `username`     | string | Yes      | Whitespace is automatically stripped                    |
| `email`        | string | Yes      | Must be a valid email address                           |
| `password`     | string | Yes      | Minimum length: **9** characters                        |
| `re_password`  | string | Yes      | Must match `password`, minimum length: **9** characters |
| `phone_number` | string | Yes      | Must be a valid phone number                            |
| `role`         | string | No       | Default: `"user"`                                       |
#### Responses
 - OK - user created
 - BAD_REQUEST - constraints are violated

### POST /login/

Logs in to user account.

#### Request Body
##### Content-Type: application/json
##### Schema
| Field      | Type   | Required | Constraints / Description        |
| ---------- | ------ | -------- | -------------------------------- |
| `email`    | string | Yes      | Must be a valid email address    |
| `password` | string | Yes      | Minimum length: **9** characters |
#### Responses
 - OK - user loged in
   Body:
   ```json
   { "access_token": "<jwt_token>"}
   ```
  - NOT_FOUND - user doesn't exists
  - BAD_REQUEST - Wrong password or message format

## User Endpoints

### GET /user/data/<int:user_id>/

Requires authentication with JWT token. `user_id` optional, defaults to id of requesting user.

#### Request Body
##### Content-Type: application/json
##### Schema
| Field         | Type            | Description                      |
| ------------- | --------------- | -------------------------------- |
| `username`    | string          | User’s display name              |
| `description` | string          | Short user bio or description    |
| `role`        | string          | User role (e.g. `user`, `admin`) |
| `location`    | object          | User location data               |
| `reviews`     | array\[object\] | Reviews about user               |

###### Location object
```
{
  "address": string | null;
  "geo_latitude": number | numeric_string | null;
  "geo_longitude": number | numeric_string | null;
  "radius": number | null;
}
```

Either address or all other fields must be not null.

###### Reviews object
```
{
  "offer_id": number;
  "rating": number;
  "review": string;
  "reviewer": string;
}
```

#### Response
 - OK - with data about user
 - NOT_FOUND - user not found
 - BAD_REQUEST - violated schema

### POST /user/data/

Updates data of logged user. No value means no update.

#### Request Body
##### Content-Type: application/json
##### Schema
| Field         | Type   | Required | Description                      |
| ------------- | ------ | -------- | -------------------------------- |
| `username`    | string | No       | User’s display name              |
| `description` | string | No       | Short user bio or description    |
| `role`        | string | No       | User role (e.g. `user`, `admin`) |
| `location`    | object | No       | User location data               |

For location object schema see [here](#location-object)

#### Response
 - OK - with data about user
 - NOT_FOUND - user not found
 - BAD_REQUEST - violated schema

## Offer Endpoints

### POST /offer/

Creates new offer with logged user as client.

#### Request Body
##### Content-Type: application/json
##### Schema

| Field           | Type                 | Required | Description                          |
| --------------- | -------------------- | -------- | ------------------------------------ |
| `description`   | string               | Yes      | Offer description                    |
| `offer_type`    | string               | Yes      | Type/category of the offer           |
| `deadline_date` | string (date)        | Yes      | RFC2616 format                       |
| `location`      | object               | Yes      | Offer location data                  |
| `flight_date`   | string (date)        | No       | RFC2616 format                       |
| `format`        | string               | Yes      |                                      |
| `parameters`    | array\[object\]      | No       |                                      |


### GET /admin/data/

Requires authentication with JWT token and checks if user is admin.

#### Request Body
##### Content-Type: application/json
| Field                          | Type    | Description                                     |
| ------------------------------ | ------- | ----------------------------------------------- |
| `number_of_admins`             | integer | Total number of admin users                     |
| `number_of_clients`            | integer | Total number of client users                    |
| `number_of_operators`          | integer | Total number of operator users                  |
| `number_of_offers`             | integer | Total number of offers in the system            |
| `client_rating_stats`          | object  | Distribution of client ratings                  |
| `operator_rating_stats`        | object  | Distribution of operator ratings                |
| `number_of_offers_by_deadline` | object  | Distribution of offers grouped by deadline date |


## Example
```
{
    "client_rating_stats": {
        "2": 1,
        "4": 2,
        "5": 4
    },
    "number_of_admins": 1,
    "number_of_clients": 9,
    "number_of_offers": 11,
    "number_of_offers_by_deadline": {
        "2024-08-20": 1,
        "2024-09-15": 1,
        "2024-10-05": 1,
        "2024-11-10": 1,
        "2024-12-01": 1,
        "2025-01-15": 1,
        "2025-01-30": 1,
        "2025-02-05": 1,
        "2025-02-10": 1,
        "2025-10-10": 2
    },
    "number_of_operators": 5,
    "operator_rating_stats": {
        "1": 1,
        "4": 2,
        "5": 4
    }
}
```

#### Response
 - OK - with data about system
 - NOT_FOUND - user not found
 - FORBIDDEN - user is not admin


### POST /decline/operator/<offer_id>/<operator_id>

Requires authentication with JWT token.

#### URL Parameters
| Parameter      | Type    | Description                               |
| -------------- | ------- | ----------------------------------------  |
| `offer_id`     | integer | ID of the offer                           |
| `operator_id`  | integer | ID of the operator to decline             |


#### Response
| Status Code | Description                                           |
| ----------- | ----------------------------------------------------  |
| 200 OK      | Operator was successfully declined (match updated)    |
| 404 NOT_FOUND | No match exists between the offer and operator      |


