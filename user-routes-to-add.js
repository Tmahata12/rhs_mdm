// ========================================
// USER MANAGEMENT ROUTES (Add after logout route - line 453)
// ========================================

// Get all users (Admin only)
app.get('/api/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        
        // Log activity
        await ActivityLog.create({
            user: req.user.userId,
            userName: req.user.name,
            action: 'view_users',
            module: 'User Management',
            details: `Viewed ${users.length} users`
        });
        
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
});

// Get single user (Admin only)
app.get('/api/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user'
        });
    }
});

// Update user (Admin only)
app.put('/api/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { name, email, phone, role, status, password } = req.body;
        
        const updateData = { name, email, phone, role, status };
        
        // If password is provided, hash it
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        // Log activity
        await ActivityLog.create({
            user: req.user.userId,
            userName: req.user.name,
            action: 'update_user',
            module: 'User Management',
            details: `Updated user: ${user.name} (${user.email})`
        });
        
        res.json({
            success: true,
            data: user,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Update user error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to update user'
        });
    }
});

// Delete user (Admin only)
app.delete('/api/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        // Prevent deleting last admin
        if (user.role === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount === 1) {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot delete the last admin user'
                });
            }
        }
        
        // Prevent user from deleting themselves
        if (user._id.toString() === req.user.userId) {
            return res.status(400).json({
                success: false,
                error: 'You cannot delete your own account'
            });
        }
        
        await User.findByIdAndDelete(req.params.id);
        
        // Log activity
        await ActivityLog.create({
            user: req.user.userId,
            userName: req.user.name,
            action: 'delete_user',
            module: 'User Management',
            details: `Deleted user: ${user.name} (${user.email})`
        });
        
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user'
        });
    }
});

// ========================================
// END OF USER MANAGEMENT ROUTES
// ========================================
