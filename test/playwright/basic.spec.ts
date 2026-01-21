import basicSetup from "../wallet-setup/basic.setup"
import { testWithSynpress } from "@synthetixio/synpress"
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright"

const test = testWithSynpress(metaMaskFixtures(basicSetup))
const { expect } = test

test("has title", async ({ page }) => {
  await page.goto("/")
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TSender/)
})

test("shows the Airdrop from when connected, otherwise, not", async ({
  page,
  context,
  metamaskPage,
  extensionId,
}) => {
  const metamask = new MetaMask(
    context,
    metamaskPage,
    basicSetup.walletPassword,
    extensionId,
  )

  // Navigate to the root page
  await page.goto("/")

  // Click the connect button to initiate the wallet connection
  await page.getByTestId("rk-connect-button").click()
  await page.getByTestId("rk-wallet-option-metaMask").waitFor({
    state: "visible",
    timeout: 30000,
  })
  await page.getByTestId("rk-wallet-option-metaMask").click()
  await metamask.connectToDapp()

  const customNetwork = {
    name: "Anvil",
    rpcUrl: "http://localhost:8545",
    chainId: 31337,
    symbol: "ETH",
  }

  await metamask.addNetwork(customNetwork)
})
