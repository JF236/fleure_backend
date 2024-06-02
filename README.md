# Fleure

Fleure is a marketplace to help people smoothly transition between different stages of life.

## Fleure Backend

This repository contains the Cloudflare Worker code for Fleure's backend.

## Development

Wrangler is the CLI tool to run Workers, Cloudflare's serverless function service.

- To install wrangler, run `npm install wrangler --save-dev` to install wrangler.
- To check installation, run `npx wrangler -v`. The current version is 3.58.0.
- To create a new Worker, run `npm create cloudflare@latest`.
- To connect your CLI environment to your Cloudflare account, run `npx wrangler login`.
- To run locally, run `npx wrangler dev`.
- To deploy to production, run `npx wrangler deploy`.

Deploying code to production is currently a manual process. Eventually this may be replaced with a CI/CD pipeline.

## Updating this README with new Workers

This README contains a list of every Worker. When making changes to the Workers in this repo, update the Workers list in the [section below](#workers).

## Workers

The following is an updated list of each Worker, including its name, functionality, and interdependencies.

#### 1. wild-credit-792f

- A simple "Hello World" program.
- No dependencies on other Workers.