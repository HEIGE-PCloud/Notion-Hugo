# Notion-Hugo

![image](https://user-images.githubusercontent.com/52968553/188502839-1de28ae0-6111-4387-99fe-fbc7d87dbc4c.png)

Notion-Hugo allows you to use [Notion](https://www.notion.so/) as your CMS and deploy your pages as a static website with [Hugo](https://gohugo.io/). So you have the full power of Notion for creating new content, with Hugo and its wonderful [ecosystem of themes](https://themes.gohugo.io/) take care of the rest for you.

## Get Started

### Create a new GitHub repository from this template

Click the green "Use this template" button in the upper-right corner to create your repo from this template. Choose "public" for the repository visibility.

<picture>
  <source width="382" media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/52968553/188245872-0aa640e4-ea85-4fc7-8035-7a267b7a28a2.png">
  <source width="382" media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/52968553/188245777-5b5d0e3d-b125-47cd-aa08-ed8e75f20773.png">
  <img width="382" alt="Use this template button" src="https://user-images.githubusercontent.com/52968553/188245777-5b5d0e3d-b125-47cd-aa08-ed8e75f20773.png">
</picture>

### Create a Notion integration

Visit [my integrations](https://www.notion.so/my-integrations) and login with your Notion account.

Click on "Create new integration" to create a new internal integration.

<img width="891" alt="Create new integration" src="https://user-images.githubusercontent.com/52968553/188289065-d2e3626e-d250-4d42-9fb4-8f641f4807ea.png">

In the capabilities section, select "Read Content" and "Read user information including email address". The "Read Content" permission is necessary for Notion-Hugo to pull your Notion content, and the "Read user information including email address" permission is used to fill front matters with author information. Notion-Hugo does not collect any of your information.

<img width="891" alt="Setup capabilities" src="https://user-images.githubusercontent.com/52968553/188289098-d318ebba-46a5-4d41-bfcd-ac0f09f35f82.png">

Click the submit button to finish creating the Notion integration.

### Setup secrets for GitHub Action

Copy the Internal Integration Token.

<img width="816" alt="Copy the Internal Integration Token" src="https://user-images.githubusercontent.com/52968553/188298208-23d96254-f8a7-4571-8863-0d920bb82143.png">

Navigate to the GitHub repo you just created, click on Settings -> Secrets -> Actions.

Click the "New Repository Secret" button on the top right.

<picture>
<source media="(prefers-color-scheme: light)" width="1148" srcset="https://user-images.githubusercontent.com/52968553/188298495-f4b1aa17-fff2-4b5e-adab-2aaddce22262.png">
<source media="(prefers-color-scheme: dark)" width="1148" srcset="https://user-images.githubusercontent.com/52968553/188298501-b479534e-db88-4c07-9e72-6bf9f9fd5a8d.png">
<img width="1148" alt="Setup secrets for GitHub Action" src="https://user-images.githubusercontent.com/52968553/188298495-f4b1aa17-fff2-4b5e-adab-2aaddce22262.png">
</picture>

Add a new secret with name `NOTION_TOKEN`, paste the copied token into the secret field. Click the green "Add secret" button to save the change.

<picture>
<source media="(prefers-color-scheme: light)" width="824" srcset="https://user-images.githubusercontent.com/52968553/188298507-5402a19f-dc35-45a9-b7b7-867f38cdb001.png">
<source media="(prefers-color-scheme: dark)" width="824" srcset="https://user-images.githubusercontent.com/52968553/188298515-3c98fbf3-128e-46ef-971f-b22b6d4da9e1.png">
<img width="824" alt="Add secret NOTION_TOKEN" src="https://user-images.githubusercontent.com/52968553/188298507-5402a19f-dc35-45a9-b7b7-867f38cdb001.png">
</picture>

### Duplicate the Notion Template

Duplicate this [Notion Template](https://pcloud.notion.site/Notion-DoIt-04bcc51cfe4c49938229c35e4f0a6fb6
) into your own workspace.

### Add connection to the Notion Page

Visit the page you just duplicated, click the ellipsis button on the top right and add the integration you just created as a connection.

<picture>
<source width="553" media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/52968553/235363588-5083d629-258f-4d46-8977-fedc0285cac0.png">
<source width="553" media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/52968553/235363618-5458ea76-89c5-4817-9ea3-4d2267b34b08.png">
<img width="553" alt="Add connection to the Notion Page" src="https://user-images.githubusercontent.com/52968553/235363588-5083d629-258f-4d46-8977-fedc0285cac0.png">
</picture>

### Configure you Hugo site

On the page you just shared with the integration, click on the "share" button again, then click the "copy link" button on the bottom right to copy the link to this page.

<picture>
<source width="539" media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/52968553/188318147-b0bd8af1-b48c-4a10-b313-3789102f00ce.png">
<source width="528" media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/52968553/188318215-8d15e203-f262-495c-9e5f-81d8e1287e30.png">
<img width="539" alt="Copy link" src="https://user-images.githubusercontent.com/52968553/188318147-b0bd8af1-b48c-4a10-b313-3789102f00ce.png">
</picture>

Now navigate back to your GitHub repository, open the `notion-hugo.config.ts` file, click to edit the file.

<picture>
<source media="(prefers-color-scheme: light)" width="379" srcset="https://user-images.githubusercontent.com/52968553/188318344-f0b1e7af-f86f-44b5-99b5-74a26410477b.png">
<source media="(prefers-color-scheme: dark)" width="379" srcset="https://user-images.githubusercontent.com/52968553/188318353-930de66c-ab2a-420a-838c-1ac271ae2cba.png">
<img width="379" alt="Edit the file on GitHub" src="https://user-images.githubusercontent.com/52968553/188318344-f0b1e7af-f86f-44b5-99b5-74a26410477b.png">
</picture>

Replace the `page_url` with the link you just copied.

<picture>
<source media="(prefers-color-scheme: light)" width="779" srcset="https://user-images.githubusercontent.com/52968553/188318385-0e49a502-14b9-4abd-8496-e14defbf9138.png">
<source media="(prefers-color-scheme: dark)" width="779" srcset="https://user-images.githubusercontent.com/52968553/188318389-0fe16143-772b-4c9f-b958-74eb7d5514b2.png">
<img width="779" alt="Replace page_url" src="https://user-images.githubusercontent.com/52968553/188318385-0e49a502-14b9-4abd-8496-e14defbf9138.png">
</picture>

Click the commit changes button at the bottom to save the file.

<picture>
<source media="(prefers-color-scheme: light)" width="779" srcset="https://user-images.githubusercontent.com/52968553/188318414-b45d159c-274a-47e6-9ff6-b01f4e05379c.png">
<source media="(prefers-color-scheme: dark)" width="779" srcset="https://user-images.githubusercontent.com/52968553/188318494-b82db93b-cb72-4dcd-acfd-31accdae7ab0.png">
<img width="779" alt="Commit changes" src="https://user-images.githubusercontent.com/52968553/188318414-b45d159c-274a-47e6-9ff6-b01f4e05379c.png">
</picture>

Navigate to Settings -> Pages to enable GitHub Pages for your repository.

<picture>
<source media="(prefers-color-scheme: light)" width="719" srcset="https://user-images.githubusercontent.com/52968553/235363799-db61e5ea-83ef-41ef-b19f-09314db296b0.png">
<source media="(prefers-color-scheme: dark)" width="719" srcset="https://user-images.githubusercontent.com/52968553/235363817-72cb9203-2b2a-4da1-b6c0-260a31257696.png">
<img width="719" alt="Enable GitHub Pages" src="https://user-images.githubusercontent.com/52968553/235363799-db61e5ea-83ef-41ef-b19f-09314db296b0.png"></picture>

There is one final step to make your website work correctly. Copy the url of your new website, then go to file `config/_default/config.toml` and change the `baseURL` from `https://example.org/` to the url you just copied. Commit the changes and wait for your website to be deployed.

Now, visit your website and you will see your content from Notion is rendered into static webpages successfully.

## Next Step

Visit the [wiki](https://github.com/HEIGE-PCloud/Notion-Hugo/wiki) to learn more about how to

- Pick a different Hugo theme
- Deploy to other platforms
- Configure Notion-DoIt

## FAQ

### Will the notion-hugo blog be synced with me Notion?

Yes. By default, the notion-hugo blog will be re-generated every 1 hour through `CD` action in Github Actions. You can change this in `.github/workflows/cd.yml` using `cron` option:

```
name: CD

on:
  ...

  schedule:
    - cron: '0 * * * *' # run every hour
```

Be aware that Github will allow you to re-run the job no more often than once per 5 minutes. 

### What if I want to re-deploy immediately as Notion database updates?

This repo at the moment supports only cron option. 

But, as an idea or direction - you could look for ways to listen for updates in Notion database and trigger Github Action when Notion database is updated. Usually webhooks are used for that purpose - but at the moment Notion has no official webhook support. So you would need to find a work around.
