import { erc20Abi } from "@/constants"
import { useReadContracts } from "wagmi"
import { Spinner } from "../ui"

type TransactionDetailsProps = {
  tokenAddress: string
  totalAmount: number
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  tokenAddress,
  totalAmount,
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

  const name = data?.[0].status === "success" ? (data[0].result as string) : ""
  const decimals =
    data?.[1].status === "success" ? (data[1].result as number) : undefined

  const amount = totalAmount / Math.pow(10, decimals || 18)
  const displayAmount = amount > 0.01 ? amount.toFixed(2) : "0.00"

  if (isLoading) {
    return <Spinner size={24} />
  }

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
