<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Admin",
 *     description="Admin management endpoints"
 * )
 */
class AdminController extends Controller
{
    /**
     * @OA\Get(
     *      path="/api/admin/users",
     *      operationId="getUsersList",
     *      tags={"Admin"},
     *      summary="Get list of all users",
     *      description="Returns list of users (Admin only)",
     *      security={{"sanctum":{}}},
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *       ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     *     )
     */
    public function index()
    {
        if (!auth()->user()->isAdmin())
            abort(403);
        // scalable solution would be pagination, but for now all users
        return User::all();
    }

    /**
     * @OA\Delete(
     *      path="/api/admin/users/{id}",
     *      operationId="deleteUser",
     *      tags={"Admin"},
     *      summary="Delete a user",
     *      description="Delete a user by ID (Admin only)",
     *      security={{"sanctum":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="User deleted",
     *       ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="User not found"
     *      )
     * )
     */
    public function destroy($id)
    {
        if (!auth()->user()->isAdmin())
            abort(403);
        $user = User::findOrFail($id);

        // Prevent deleting self? or superadmin?
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete yourself'], 400);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

    /**
     * @OA\Get(
     *      path="/api/admin/activity",
     *      operationId="getAdminActivity",
     *      tags={"Admin"},
     *      summary="Get system activity",
     *      description="Returns recent transactions for audit log (Admin only)",
     *      security={{"sanctum":{}}},
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *       ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     *     )
     */
    public function activity()
    {
        if (!auth()->user()->isAdmin())
            abort(403);
        // As a proxy for "Activity", we'll return the latest 50 transactions across the system
        // In a real system, you'd have a dedicated ActivityLog model.
        $transactions = Transaction::with('user:id,name,email')
            ->latest('created_at')
            ->limit(50)
            ->get()
            ->map(function ($t) {
                $typeLabel = ucfirst($t->type);
                $amount = number_format($t->amount, 2);
                
                return [
                    'id' => $t->id,
                    'user' => $t->user->name ?? 'Unknown',
                    'action' => 'Transaction Created',
                    'target' => 'Transaction #' . $t->id,
                    'details' => "{$typeLabel}: \${$amount} - {$t->category}",
                    'at' => $t->created_at
                ];
            });

        return $transactions;
    }
}
