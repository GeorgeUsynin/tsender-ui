import { Dispatch, SetStateAction, useEffect } from "react"
import { useReadContracts } from "wagmi"
import { formatUnits } from "viem"
import { erc20Abi, STATUS } from "@/constants"
import { Spinner } from "../ui"

type TransactionDetailsProps = {
  tokenAddress: string
  totalAmount: number
  setIsError: Dispatch<SetStateAction<boolean>>
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  tokenAddress,
  totalAmount,
  setIsError,
}) => {
  const { data, isLoading } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "name",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "decimals",
      },
    ],
  })

  const hasFailure = !!data?.some((res) => res.status === STATUS.FAILURE)

  useEffect(() => {
    if (!data) return

    setIsError(hasFailure)

    if (hasFailure) {
      data.forEach((res) => res.error && console.log(res.error))
    }
  }, [data, hasFailure])

  if (!data || isLoading) {
    return <Spinner size={24} />
  }

  if (hasFailure) {
    return <div>Please check the console for errors!</div>
  }

  const name = data[0].result as string
  const decimals = data[1].result as number
  const amount = formatUnits(BigInt(totalAmount), decimals)
  const displayAmount =
    Number(amount) > 0.01 ? Number(amount).toFixed(2) : "0.00"

  return (
    <div className="mt-6 space-y-3 text-sm border border-solid border-neutral-300 dark:border-neutral-600 rounded-xl p-4">
      <div className="font-semibold text-gray-800 dark:text-gray-200">
        Transaction details
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Token name:</span>
        <span className="font-medium">{name}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">Amount (wei):</span>
        <span className="font-medium">{totalAmount}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">
          Amount (tokens):
        </span>
        <span className="font-medium">
          {decimals ? displayAmount : totalAmount}
        </span>
      </div>
    </div>
  )
}
