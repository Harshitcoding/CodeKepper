import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

const Loading = () => {
  return (
    <div>
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden bg-black border-gray-800 text-white">
                <CardHeader className="pb-0">
                  <Skeleton className="h-6 w-2/3" />
                </CardHeader>
                <CardContent className="pb-0">
                  <Skeleton className="h-24 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-20" />
                </CardFooter>
              </Card>
            ))}
          </div>
    </div>
  )
}
export default Loading