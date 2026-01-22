"use client"

import { InputField, LoadingButton } from "@/components/ui"
import { useCallback, useEffect, useMemo, useState } from "react"
import { chainsToTSender, tSenderAbi, erc20Abi } from "@/constants"
import { useChainId, useConfig, useConnection, useWriteContract } from "wagmi"
import { readContract, waitForTransactionReceipt } from "@wagmi/core"
import { calculateTotal, splitStringByCommasAndNewLines } from "@/utils"
import { isAddress } from "viem"
import { TransactionDetails } from "./TransactionDetails"

const labels = {
  tokenAddress: "Token address",
  recipients: "Recipients (comma or new line separated)",
  amounts: "Amounts (wei; comma or new line separated)",
}

export const AirdropForm = () => {
  const [tokenAddress, setTokenAddress] = useState("")
  const [recipients, setRecipients] = useState("")
  const [amounts, setAmounts] = useState("")
  const [isError, setIsError] = useState(false)
  const chainId = useChainId()
  const config = useConfig()
  const { address: currentAccount } = useConnection()
  const { isPending, mutateAsync } = useWriteContract()
  const totalAmount: number = useMemo(() => calculateTotal(amounts), [amounts])
  const disabled =
    isPending || !isAddress(tokenAddress) || !recipients || !amounts || isError

  useEffect(() => {
    const savedTokenAddress = localStorage.getItem("tokenAddress")
    const savedRecipients = localStorage.getItem("recipients")
    const savedAmounts = localStorage.getItem("amounts")

    if (savedTokenAddress) setTokenAddress(savedTokenAddress)
    if (savedRecipients) setRecipients(savedRecipients)
    if (savedAmounts) setAmounts(savedAmounts)
  }, [])

  useEffect(() => {
    localStorage.setItem("tokenAddress", tokenAddress)
  }, [tokenAddress])

  useEffect(() => {
    localStorage.setItem("recipients", recipients)
  }, [recipients])

  useEffect(() => {
    localStorage.setItem("amounts", amounts)
  }, [amounts])

  const onValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    switch (e.target.name) {
      case labels.tokenAddress:
        setTokenAddress(e.target.value)
        break
      case labels.recipients:
        setRecipients(e.target.value)
        break
      case labels.amounts:
        setAmounts(e.target.value)
        break
    }
  }

  const getApprovedAmount = async (tSenderAddress: string): Promise<number> => {
    if (!tSenderAddress) {
      alert("No address found, please use a supported chain!")
      return 0
    }
    // read from the chain to see if we approved enough tokens
    const response = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [currentAccount, tSenderAddress],
    })
    // token.allowance(account, tsender)
    return response as number
  }

  const triggerAirdropERC20 = async (contractAddress: string) => {
    await mutateAsync({
      abi: tSenderAbi,
      address: contractAddress as `0x${string}`,
      functionName: "airdropERC20",
      args: [
        tokenAddress,
        // Comma or new line separated
        splitStringByCommasAndNewLines(recipients),
        splitStringByCommasAndNewLines(amounts),
        BigInt(totalAmount),
      ],
    })
  }

  const resetForm = useCallback(() => {
    setTokenAddress("")
    setRecipients("")
    setAmounts("")
  }, [])

  const handleSubmit = async () => {
    // 1. If already approved, moved to step 2
    // 1a. Approve our TSender contract to send our tokens
    // 2. Call the airdrop function on the TSender contract
    // 3. Wait for the transaction to be mined

    const tSenderAddress = chainsToTSender[chainId]["tsender"]
    const approvedAmount = await getApprovedAmount(tSenderAddress)

    if (approvedAmount < totalAmount) {
      const approvalHash = await mutateAsync({
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [tSenderAddress, BigInt(totalAmount)],
      })
      await waitForTransactionReceipt(config, {
        hash: approvalHash,
      })
    }
    await triggerAirdropERC20(tSenderAddress)
    resetForm()
  }

  return (
    <div className="w-full md:w-2/3 max-w-2xl mx-auto flex flex-col gap-4 mt-6 border border-black dark:border-white rounded-xl p-4">
      <InputField
        label={labels.tokenAddress}
        placeholder="0x"
        value={tokenAddress}
        onChange={onValueChange}
      />
      <InputField
        label={labels.recipients}
        placeholder="0x1234, 0x5678"
        value={recipients}
        onChange={onValueChange}
        large
      />
      <InputField
        label={labels.amounts}
        placeholder="100, 200, 300"
        value={amounts}
        onChange={onValueChange}
        large
      />
      <LoadingButton
        onClick={handleSubmit}
        disabled={disabled}
        loading={isPending}
      >
        {isPending ? "Confirming in wallet" : "Send tokens"}
      </LoadingButton>
      {isAddress(tokenAddress) && (
        <TransactionDetails
          tokenAddress={tokenAddress}
          totalAmount={totalAmount}
          setIsError={setIsError}
        />
      )}
    </div>
  )
}
