# Dashboard

Epitech 3rd year project for the AppDev module.

## Summary

* [Start Up](#start)
* [Services](#services)
	* [weather](#weather)
		* [current_weather](#current_weather)
		* [forecast_weather](#forecast_weather)
	* [yammer](#yammer)
		* [group_messages](#group_messages)
		* [thread_messages](#thread_messages)
	* [github](#github)
		* [repo_commits](#repo_commits)
		* [repo_issues](#repo_issues)
	* [trello](#trello)
		* [trello_board](#trello_board)
		* [trello_member_task](#trello_member_task)
	* [epitech_intranet](#epitech_intranet)
		* [intra_modules](#intra_modules)
		* [intra_infos](#intra_infos)
	* [cryptocurrencies](#cryptocurrencies)
		* [crypto_actual_value](#crypto_actual_value)
		* [crypto_actual_worth](#crypto_actual_worth)
	* [air_quality](#air_quality)
		* [air_quality](#air_quality)
* [Routes](#Routes)


## <a name="start"></a>Start Up

Build the project:

```bash
./docker-compose build
```

Start the application:

```bash
./docker-compose up
```

Then go to https://localhost:8080

You are on our Dashboard !!

## <a name="services"></a>Services

### <a name="weather"></a>weather

#### <a name="current_weather"></a>current_weather

Shows weather in choosen city

##### Parameters

`city: string`

#### <a name="forecast_weather"></a>forecast_weather

Shows weather forecast in choosen city

##### Parameters

`city: string`


### <a name="yammer"></a>yammer

#### <a name="group_messages"></a>group_messages

Shows yammer group messages

##### Parameters

`groupUrl: string`

#### <a name="thread_messages"></a>thread_messages

Shows yammer thread and comments

##### Parameters

`threadUrl: string`

### <a name="github"></a>github

#### <a name="repo_commits"></a>repo_commits

Shows commits on a gived repository

##### Parameters

`repositoryUrl: string`

#### <a name="repo_issues"></a>repo_issues

Shows issues on a gived repository

##### Parameters

`repositoryUrl: string`

### <a name="trello"></a>trello

#### <a name="trello_board"></a>trello_board

Shows a choosen trello board

##### Parameters

`boardId: string`

#### <a name="trello_member_tasks"></a>trello_member_tasks

Shows a choosen member tasks in a choosen board

##### Parameters

`boardId: string`

`memberId: string`

### <a name="epitech_intranet"></a>epitech_intranet

#### <a name="intra_modules"></a>intra_modules

Shows epitech intranet modules subscribed or unsubscribed

##### Parameters

`subscribed: bool`

#### <a name="intra_infos"></a>intra_infos

Shows epitech intranet user informations: you can choose Image, GPA, or aquired credits

##### Parameters

`infoType: string`


### <a name="cryptocurrencies"></a>cryptocurrencies

#### <a name="crypto_actual_value"></a>crypto_actual_value

Shows value of choosen cryptocurrency in choosen currency

##### Parameters

`cryptocurrency: string`

`currency: string`


#### <a name="crypto_actual_worth"></a>crypto_actual_worth

Shows capitalization of choosen cryptocurrency in choosen currency

##### Parameters

`cryptocurrency: string`

`currency: string`


### <a name="air_quality"></a>air_quality

#### <a name="air_quality"></a>air_quality

Shows air quality of a choosen city

##### Parameters

`city: string`


## <a name="Routes"></a>Routes

#### <a name="register"></a>Register request

Request to register an account.

Route : `{{api-url}}/register`

Type: `POST`

Request body: 
```json
{
  "email": "{{email}}",
  "password": "{{password}}",
  "name": "{{name}}"
}
```


#### <a name="login"></a>Login request

Request to login to an account.

Route : `{{api-url}}/login`

Type: `POST`

Request body: 
```json
{
  "email": "{{email}}",
  "password": "{{password}}"
}
```


#### <a name="change_widget_positions"></a>Change widget position

Request to change a widget position.

Route : `{{api-url}}/change_widget_positions`

Type: `POST`

Headers:

```json
{
  "Authorization": "{{access_token}}"
}
```

Request body: 
```json
{
  "widget_id": "{{widget_id}}",
  "x": "{{x}}",
  "y": "{{y}}"
}
```

#### <a name="delete_widget"></a>Delete widget

Request to delete a widget.

Route : `{{api-url}}/delete_widget`

Type: `DELETE`

Headers:

```json
{
  "Authorization": "{{access_token}}"
}
```

Request body: 
```json
{
  "widget_id": "{{widget_id}}"
}
```

#### <a name="delete_user"></a>Delete user

Request to delete an user.

Route : `{{api-url}}/change_widget_positions`

Type: `POST`

Headers:

```json
{
  "Authorization": "{{access_token}}"
}
```

Request body: 
```json
{
  "widget_id": "{{widget_id}}",
  "user_access_token": "{{user_access_token}}"
}
```

#### <a name="create_widget"></a>Create a widget

Requests to create a widget.

Route : `{{api-url}}/{{widget_name}}`

Type: `POST, GET, PUT`

Use `POST` to create the widget, use `GET` to get datas of the widget, then use `PUT` to update widget parameters.

**Create widget (`POST`):**

Headers:

```json
{
  "Authorization": "{{access_token}}"
}
```

Request body: 
```json
{
  "paramter1": "{{paramter1}}",
  "paramter2": "{{paramter2}}",
  "paramter3": "{{paramter3}}",
  "paramter...": "{{paramter...}}",
  "refresh_time": "{{refersh_time}}"
}
```

**Get widget datas (`GET`):**

Headers:

```json
{
  "Authorization": "{{access_token}}"
}
```

Url parameters:

`widget_id={{widget_id}}`


**Update widget (`PUT`):**

Headers:

```json
{
  "Authorization": "{{access_token}}"
}
```

Request body: 
```json
{
  "paramter1": "{{paramter1}}",
  "paramter2": "{{paramter2}}",
  "paramter3": "{{paramter3}}",
  "paramter...": "{{paramter...}}",
  "refresh_time": "{{refersh_time}}"
}
```
