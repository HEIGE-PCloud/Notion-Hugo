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

<img width="891" alt="image" src="https://user-images.githubusercontent.com/52968553/188289065-d2e3626e-d250-4d42-9fb4-8f641f4807ea.png">

In the capabilities section, select "Read Content" and "Read user information including email address". The "Read Content" permission is necessary for Notion-Hugo to pull your Notion content, and the "Read user information including email address" permission is used to fill front matters with author information. Notion-Hugo does not collect any of your information.

<img width="891" alt="image" src="https://user-images.githubusercontent.com/52968553/188289098-d318ebba-46a5-4d41-bfcd-ac0f09f35f82.png">

Click the submit button to finish creating the Notion integration.

### Setup secrets for GitHub Action

Copy the Internal Integration Token.

<img width="816" alt="image" src="https://user-images.githubusercontent.com/52968553/188298208-23d96254-f8a7-4571-8863-0d920bb82143.png">

Navigate to the GitHub repo you just created, click on Settings -> Secrets -> Actions.

Click the "New Repository Secret" button on the top right.

<picture>
<source media="(prefers-color-scheme: light)" width="1148" alt="image" srcset="https://user-images.githubusercontent.com/52968553/188298495-f4b1aa17-fff2-4b5e-adab-2aaddce22262.png">
<source media="(prefers-color-scheme: dark)" width="1148" alt="image" srcset="https://user-images.githubusercontent.com/52968553/188298501-b479534e-db88-4c07-9e72-6bf9f9fd5a8d.png">
<img width="1148" alt="image" src="https://user-images.githubusercontent.com/52968553/188298495-f4b1aa17-fff2-4b5e-adab-2aaddce22262.png">
</picture>

Add a new secret with name `NOTION_TOKEN`, paste the copied token into the secret field. Click the green "Add secret" button to save the change.

<picture>
<source media="(prefers-color-scheme: light)" width="824" alt="image" srcset="https://user-images.githubusercontent.com/52968553/188298507-5402a19f-dc35-45a9-b7b7-867f38cdb001.png">
<source media="(prefers-color-scheme: dark)" width="824" alt="image" srcset="https://user-images.githubusercontent.com/52968553/188298515-3c98fbf3-128e-46ef-971f-b22b6d4da9e1.png">
<img width="824" alt="image" src="https://user-images.githubusercontent.com/52968553/188298507-5402a19f-dc35-45a9-b7b7-867f38cdb001.png">
</picture>

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

### Configure you Hugo site

On the page you just shared with the integration, click on the "share" button again, then click the "copy link" button on the bottom right to copy the link to this page.

<picture>
<source width="539" alt="image" media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/52968553/188318147-b0bd8af1-b48c-4a10-b313-3789102f00ce.png">
<source width="528" alt="image" media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/52968553/188318215-8d15e203-f262-495c-9e5f-81d8e1287e30.png">
<img width="539" alt="image" src="https://user-images.githubusercontent.com/52968553/188318147-b0bd8af1-b48c-4a10-b313-3789102f00ce.png">
</picture>

Now navigate back to your GitHub repository, open the `notion-hugo.config.ts` file, click to edit the file.

<picture>
<source media="(prefers-color-scheme: light)" width="379" alt="image" srcset="https://user-images.githubusercontent.com/52968553/188318344-f0b1e7af-f86f-44b5-99b5-74a26410477b.png">
<source media="(prefers-color-scheme: dark)" width="379" alt="image" srcset="https://user-images.githubusercontent.com/52968553/188318353-930de66c-ab2a-420a-838c-1ac271ae2cba.png">
<img width="379" alt="image" src="https://user-images.githubusercontent.com/52968553/188318344-f0b1e7af-f86f-44b5-99b5-74a26410477b.png">
</picture>

Replace the `page_url` with the link you just copied.

<picture>
<source media="(prefers-color-scheme: light)" width="779" alt="image" srcset="https://user-images.githubusercontent.com/52968553/188318385-0e49a502-14b9-4abd-8496-e14defbf9138.png">
<source media="(prefers-color-scheme: dark)" width="779" alt="image" srcset="https://user-images.githubusercontent.com/52968553/188318389-0fe16143-772b-4c9f-b958-74eb7d5514b2.png">
<img width="779" alt="image" src="https://user-images.githubusercontent.com/52968553/188318385-0e49a502-14b9-4abd-8496-e14defbf9138.png">
</picture>

Click the commit changes button at the bottom to save the file.

<picture>
<source media="(prefers-color-scheme: light)" width="779" alt="image" srcset="https://user-images.githubusercontent.com/52968553/188318414-b45d159c-274a-47e6-9ff6-b01f4e05379c.png">
<source media="(prefers-color-scheme: dark)" width="779" alt="image" srcset="https://user-images.githubusercontent.com/52968553/188318494-b82db93b-cb72-4dcd-acfd-31accdae7ab0.png">
<img width="779" alt="image" src="https://user-images.githubusercontent.com/52968553/188318414-b45d159c-274a-47e6-9ff6-b01f4e05379c.png">
</picture>

Wait a minute or so for your site to be built. You can check the progress under the Actions tab, the CD workflow is building and deploying your site. Then navigate to Settings -> Pages, your Hugo site should now be deployed to the GitHub Pages.

<picture>
<source media="(prefers-color-scheme: light)" width="1093" alt="image" srcset="https://user-images.githubusercontent.com/52968553/188319711-3fd3ae82-c214-4245-b57f-a15a909d29fa.png">
<source media="(prefers-color-scheme: dark)" width="1093" alt="image" srcset="https://user-images.githubusercontent.com/52968553/188319720-0acf810a-fdef-4ecc-aafc-40b8164a3c4f.png">
<img width="1093" alt="image" src="https://user-images.githubusercontent.com/52968553/188319711-3fd3ae82-c214-4245-b57f-a15a909d29fa.png">
</picture>

There is one final step to make your website work correctly. Copy the url of your new website, then go to file `config/_default/config.toml` and change the `baseURL` from `https://example.org/` to the url you just copied. Commit the changes and wait for your website to be deployed again.

Now, visit your website again and you will see your content from Notion is rendered into static webpages successfully.

## Next Step

Visit the [wiki](https://github.com/HEIGE-PCloud/Notion-Hugo/wiki) to learn more about how to

- Pick a different Hugo theme
- Deploy to other platforms
- Configure Notion-DoIt

## License

This project is open sourced under the [GNU GPL license v3](https://www.gnu.org/licenses/gpl-3.0.html), you may use the project under the terms if you are creating an open source project under a license compatible with it.

Consider purchasing a [commercial license](https://buy.stripe.com/aEU4ixg529wA1Fu144) if your project is not compatible with GPLv3.
