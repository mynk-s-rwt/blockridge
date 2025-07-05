## Deployed Application
You can access the deployed application here: [https://blockridge-assesment.vercel.app/](https://blockridge-assesment.vercel.app/)

## Getting Started

This project uses [pnpm](https://pnpm.io/) for efficient and reliable dependency management.

If you don't have pnpm installed, you can install it globally:
```bash
npm install -g pnpm
```

Alternatively, you can run pnpm commands directly using `npx`:
```bash
npx pnpm install
npx pnpm dev
```

First, run the development server:

```bash
pnpm dev
# or if you don't have pnpm installed globally
npx pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Technical Notes

### Error Handling and Network Awareness
For `wBTC` handling, the balance is fetched directly from the blockchain. The token decimals are obtained from the local configuration (`TOKENS.BTC.decimals`) for simplicity and performance, rather than querying the `wBTC` smart contract for this information at runtime.

To ensure a robust user experience, the application provides clear feedback directly on the main conversion button. This includes:
*   **Wallet Connection Status:** The button prompts the user to "Connect Wallet" if no Web3 wallet is detected.
*   **Network Mismatch:** If the user is on an incorrect blockchain network (e.g., not Ethereum Mainnet), the button changes to "Switch Network" to guide them.
*   **Insufficient Balance:** If the input amount exceeds the user's available balance for the selected currency, the button displays "Insufficient Balance" to immediately inform the user.
*   **External Service Errors:** Generic messages like "Failed to fetch price data" or "Failed to fetch balance" appear right below the conversion result area for issues with external services (e.g., Coingecko API) or blockchain interactions. These error messages complement the button's state by providing more detailed context when a conversion cannot proceed.
