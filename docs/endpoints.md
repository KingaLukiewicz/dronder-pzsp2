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


