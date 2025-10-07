export default function UserProfile({ params }: any) {
    return (
        <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4 border p-8 rounded">
                <h1 className="text-2xl font-bold">Profile</h1>
                <p>Profile Page: <span className="bg-orange-600 px-2 py-1 rounded">{params.id}</span></p>
            </div>
        </div>
    )
}