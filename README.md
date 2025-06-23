# Notion-Hugo

![image](https://user-images.githubusercontent.com/52968553/188502839-1de28ae0-6111-4387-99fe-fbc7d87dbc4c.png)

Notion-Hugo allows you to use [Notion](https://www.notion.so/) as your CMS and deploy your pages as a static website with [Hugo](https://gohugo.io/). So you have the full power of Notion for creating new content, with Hugo and its wonderful [ecosystem of themes](https://themes.gohugo.io/) take care of the rest for you.

Notion-Hugo deploys your website to Cloudflare Pages, which has a generous free tier and is easy to set up. Notion-Hugo also uses [Functions](https://developers.cloudflare.com/pages/functions/) and [KV](https://developers.cloudflare.com/kv/) to power your website. Register a [Cloudflare account](https://dash.cloudflare.com/sign-up) and be ready to go.

## Get Started

### Create a new GitHub repository from this template

Click the green **Use this template** button in the upper-right corner to create your repo from this template. Choose **public** for the repository visibility.

<picture>
  <source width="382" media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/52968553/188245872-0aa640e4-ea85-4fc7-8035-7a267b7a28a2.png">
  <source width="382" media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/52968553/188245777-5b5d0e3d-b125-47cd-aa08-ed8e75f20773.png">
  <img width="382" alt="Use this template button" src="https://user-images.githubusercontent.com/52968553/188245777-5b5d0e3d-b125-47cd-aa08-ed8e75f20773.png">
</picture>

### Create a Notion integration

Visit [my integrations](https://www.notion.so/my-integrations) and login with your Notion account.

Click on **Create new integration** to create a new internal integration.

<img width="891" alt="Create new integration" src="https://user-images.githubusercontent.com/52968553/188289065-d2e3626e-d250-4d42-9fb4-8f641f4807ea.png">

In the capabilities section, select **Read Content** and **Read user information including email address**. The **Read Content** permission is necessary for Notion-Hugo to pull your Notion content, and the **Read user information including email address** permission is used to fill front matters with author information. Notion-Hugo does not collect any of your information.

<img width="891" alt="Setup capabilities" src="https://user-images.githubusercontent.com/52968553/188289098-d318ebba-46a5-4d41-bfcd-ac0f09f35f82.png">

Click the submit button to finish creating the Notion integration.

### Setup secrets for GitHub Action

Copy the Internal Integration Token.

<img width="816" alt="Copy the Internal Integration Token" src="https://user-images.githubusercontent.com/52968553/188298208-23d96254-f8a7-4571-8863-0d920bb82143.png">

Navigate to the GitHub repo you just created, click on **Settings** -> **Secrets** -> **Actions**.

Click the **New Repository Secret** button on the top right.

<picture>
<source media="(prefers-color-scheme: light)" width="1148" srcset="https://user-images.githubusercontent.com/52968553/188298495-f4b1aa17-fff2-4b5e-adab-2aaddce22262.png">
<source media="(prefers-color-scheme: dark)" width="1148" srcset="https://user-images.githubusercontent.com/52968553/188298501-b479534e-db88-4c07-9e72-6bf9f9fd5a8d.png">
<img width="1148" alt="Setup secrets for GitHub Action" src="https://user-images.githubusercontent.com/52968553/188298495-f4b1aa17-fff2-4b5e-adab-2aaddce22262.png">
</picture>

Add a new secret with name `NOTION_TOKEN`, paste the copied token into the secret field. Click the green **Add secret** button to save the change.

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

On the page you just shared with the integration, click on the **share** button again, then click the **Copy link** button on the bottom right to copy the link to this page.

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

### Deploy to Cloudflare Pages

Navigate to the [Cloudflare Pages](https://dash.cloudflare.com/pages) dashboard, click the **Workers & Pages** tab on the left, then click the **Create** button, then select the **Pages** tab, and click the **Connect to Git** button. Choose Notion-Hugo from the repository list, then click the **Begin Setup** button.

<picture>
<source media="(prefers-color-scheme: light)" width="2559" srcset="https://github.com/user-attachments/assets/ca5ce9fe-09a9-439f-bd94-ead08c340874">
<source media="(prefers-color-scheme: dark)" width="2559" srcset="https://github.com/user-attachments/assets/38a00d38-0ee4-45eb-ba77-5690e0e48049">
<img width="2559" alt="Edit the file on GitHub" src="https://github.com/user-attachments/assets/ca5ce9fe-09a9-439f-bd94-ead08c340874">
</picture>

Fill in the build settings as follows:

- Build command: `npm install; npm start; hugo`
- Build output directory: `public`
- Environment variables:
  - `HUGO_VERSION`: `0.140.0` (fill in the latest version of Hugo that you can find [here](https://github.com/gohugoio/hugo/releases))
  - `NODE_VERSION`: `22.12.0` (fill in the latest version of Node.js that you can find [here](https://nodejs.org/en/download))
  - `NOTION_TOKEN`: `secret_token` (fill in the token you copied from the Notion integration)

Click the **Save and Deploy** button to deploy your website.

<picture>
<source media="(prefers-color-scheme: light)" width="2559" srcset="https://github.com/user-attachments/assets/a84d6b89-2d8f-4bae-adcb-b3d9d05a076b">
<source media="(prefers-color-scheme: dark)" width="2559" srcset="https://github.com/user-attachments/assets/91e8d47c-3dbc-4b0e-86f8-3fc0d5151c23">
<img width="2559" alt="Edit the file on GitHub" src="https://github.com/user-attachments/assets/a84d6b89-2d8f-4bae-adcb-b3d9d05a076b">
</picture>

Now we need to add a KV namespace for the Cloudflare Functions. Navigate to the **Storage & Database** tab on the left, then click the **KV** tab, then click the **+ Create** button to create a new namespace. You can name it whatever you like.

<picture>
<source media="(prefers-color-scheme: light)" width="2559" srcset="https://github.com/user-attachments/assets/7d56b453-8053-4296-b0eb-1a8df2146cc6">
<source media="(prefers-color-scheme: dark)" width="2559" srcset="https://github.com/user-attachments/assets/d432ce02-9527-4662-8360-21c0922cca64">
<img width="2559" alt="Edit the file on GitHub" src="https://github.com/user-attachments/assets/7d56b453-8053-4296-b0eb-1a8df2146cc6">
</picture>

Now, navigate to **Workers & Pages** > **your_project** > **Settings** > **Bindings**, add a new **KV Namespace** binding, with **Variable name** set to `KV` and the **KV namespace** set to the namespace you just created. Click the **Save** button to save the changes.

<picture>
<source media="(prefers-color-scheme: light)" width="2559" srcset="https://github.com/user-attachments/assets/6664cee5-02af-40e8-911f-1a82be185e8f">
<source media="(prefers-color-scheme: dark)" width="2559" srcset="https://github.com/user-attachments/assets/68befd19-b169-413a-9c4f-46cf5de5c830">
<img width="2559" alt="Edit the file on GitHub" src="https://github.com/user-attachments/assets/6664cee5-02af-40e8-911f-1a82be185e8f">
</picture>

Finally, we need to configure the baseURL. Visit the **Deployments** tab to check the domain of your website (in this case, it is `https://notion-hugo-example.pages.dev`). 

<picture>
<source media="(prefers-color-scheme: light)" width="2559" srcset="https://github.com/user-attachments/assets/52ed73d6-db6c-45ac-a238-d0d50908dba2">
<source media="(prefers-color-scheme: dark)" width="2559" srcset="https://github.com/user-attachments/assets/31f8b30b-c997-4ec6-8cc5-3075d15867be">
<img width="2559" alt="Edit the file on GitHub" src="https://github.com/user-attachments/assets/52ed73d6-db6c-45ac-a238-d0d50908dba2">
</picture>

Navigate back to your GitHub repository, change the `base_url` in [`notion-hugo.config.ts`](https://github.com/HEIGE-PCloud/Notion-Hugo/blob/main/notion-hugo.config.ts) to the domain of your website. Also update the `baseURL` in [`config/_default/config.toml`](https://github.com/HEIGE-PCloud/Notion-Hugo/blob/main/config/_default/config.toml) to this value. Click the commit changes button at the bottom to save the file.

Congratulations! Your website is now live at the domain you just configured.

### Next steps

Pick a [Hugo theme](https://themes.gohugo.io/) you like, and add it to your repository. You can customize the theme to your liking.

Use a custom domain for your website. You can add a custom domain in the Cloudflare Pages dashboard. See the [Cloudflare documentation](https://developers.cloudflare.com/pages/configuration/custom-domains/) for more information. The baseURL needs to be updated after changing the domain.

## FAQ

### Does Notion-Hugo sync with my Notion?

Yes. By default Notion-Hugo syncs with your Notion every midnight. Any updated content will be committed to the repository. You can change the schedule in the `.github/workflows/cd.yml` file.

```yaml
name: CD
on:
  schedule:
    - cron: '0 0 * * *'
```

### How do I manually sync with Notion?

You can trigger the CD workflow manually by navigating to the **Actions** tab in your repository, then click the **CD** workflow, then click the **Run workflow** button to trigger the workflow.
