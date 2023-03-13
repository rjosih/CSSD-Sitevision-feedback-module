## Get started 
- Create a file called `.dev_properties.json`in the root. Add following data: 
   
   
````
{
  "domain": "Your domain url",
  "siteName": "Your site name",
  "addonName": "news-listing",
  "username": "Your username",
  "password": "Your password"
}
````
   
- `npm run create-addon` creates an addon with the name configured in the setup task
- `npm run dev` watches files for changes and runs `build force-deploy` on save
- Go to a page in SiteVision and fetch the WebApp in `Modules` by writing the `addonName`.
- Deploy your page and see the module in production :)
