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

### Performance Optimizations
To enhance performance and user experience, the application incorporates the following optimizations:
*   **Debouncing Input:** User input in the currency fields is debounced to reduce the frequency of API calls for price fetching. This prevents excessive requests while the user is typing, leading to a smoother and more efficient interaction.
*   **AbortController for API Calls:** An `AbortController` is utilized for API calls related to price fetching. This ensures that when a new request is made (e.g., due to a debounced input change), any previous, slower pending requests are aborted. This prevents outdated data from being displayed if an older request finishes after a newer, more relevant one.

## Key Technologies Used
This project leverages the following key technologies to provide a robust and efficient decentralized application:

*   **shadcn/ui**: A collection of reusable UI components built with Radix UI and Tailwind CSS, providing a modern and accessible user interface.
*   **Viem**: A TypeScript interface for Ethereum that provides low-level primitives for interacting with the blockchain, ensuring efficient and reliable blockchain operations.
*   **Wagmi**: A React Hooks library for Ethereum, simplifying the integration of blockchain functionalities like wallet connections, contract interactions, and balance fetching.
*   **ConnectKit**: A wallet connector library that provides a seamless and user-friendly experience for connecting various Web3 wallets to the application.
