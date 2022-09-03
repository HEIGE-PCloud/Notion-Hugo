# Notion-Hugo

Notion-Hugo allows you to use [Notion](https://www.notion.so/) as your CMS and deploy your pages as a static website with [Hugo](https://gohugo.io/). So you have the full power of Notion for creating new content with the powerful Hugo and its wonderful [theme ecosystem](https://themes.gohugo.io/) for handling the rest.

## Get Started

### Create a new repo from this template

Click the green "Use this template" button in the upper-right corner to create your repo from this template.

<picture>
  <source width="382" media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/52968553/188245872-0aa640e4-ea85-4fc7-8035-7a267b7a28a2.png">
  <source width="382" media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/52968553/188245777-5b5d0e3d-b125-47cd-aa08-ed8e75f20773.png">
  <img width="382" alt="Use this template button" src="https://user-images.githubusercontent.com/52968553/188245777-5b5d0e3d-b125-47cd-aa08-ed8e75f20773.png">
</picture>

### Create a Notion integration

Visit [my integrations](https://www.notion.so/my-integrations) and login with your Notion account.

Click "Create new integration" to create a new internal integration.

<img width="891" alt="image" src="https://user-images.githubusercontent.com/52968553/188289065-d2e3626e-d250-4d42-9fb4-8f641f4807ea.png">

In the capabilities section, select "Read Content" and "Read user information including email address".

<img width="891" alt="image" src="https://user-images.githubusercontent.com/52968553/188289098-d318ebba-46a5-4d41-bfcd-ac0f09f35f82.png">

Click the submit button to finish creating the Notion integration.

### Duplicate the Notion Template

Duplicate this [Notion Template](https://pcloud.notion.site/Notion-DoIt-04bcc51cfe4c49938229c35e4f0a6fb6
) into your own workspace.

### Share the Notion Page with the integration

Visit the page you just duplicated, click the share button on the top right and share it with the integration you just created.

<picture>
<source width="552" media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/52968553/188289212-93e6c208-bfb0-4386-b65d-0b4535d94f6e.png">
<source width="552" media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/52968553/188289204-16fb52f2-b643-47d3-a2a2-c9e71be55bda.png">
<img width="552" alt="image" src="https://user-images.githubusercontent.com/52968553/188289212-93e6c208-bfb0-4386-b65d-0b4535d94f6e.png">
</picture>

### Setup secrets for GitHub Action

`NOTION_TOKEN`

### Configure you Hugo site

`config/notion.toml`
`config/_default/config.toml`


