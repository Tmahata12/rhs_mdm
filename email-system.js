// ========================================
// Email Notification System
// RHS MDM V2.0 - Automated Email Reports & Alerts
// ========================================

const nodemailer = require('nodemailer');

class EmailNotificationSystem {
    constructor() {
        this.transporter = null;
        this.initialized = false;
    }

    // Initialize email transporter
    async init() {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.log('⚠️  Email not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env');
            return false;
        }

        try {
            this.transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            // Verify connection
            await this.transporter.verify();
            this.initialized = true;
            console.log('✅ Email system initialized');
            return true;
        } catch (error) {
            console.error('❌ Email initialization failed:', error.message);
            return false;
        }
    }

    // Send daily attendance report
    async sendDailyReport(data) {
        if (!this.initialized) return false;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">🍽️ Daily MDM Report</h1>
                    <p style="margin: 5px 0;">Ramnagar High School</p>
                </div>
                
                <div style="padding: 20px; background: #f9f9f9;">
                    <h2>Attendance Summary - ${data.date}</h2>
                    
                    <table style="width: 100%; border-collapse: collapse; background: white;">
                        <tr style="background: #667eea; color: white;">
                            <th style="padding: 10px; text-align: left;">Metric</th>
                            <th style="padding: 10px; text-align: right;">Value</th>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Total Students</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;"><strong>${data.totalStudents || 0}</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Present Today</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;"><strong>${data.attendance || 0}</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Meals Served</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;"><strong>${data.meals || 0}</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Rice Used (kg)</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;"><strong>${data.rice || 0}</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Total Cost</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;"><strong>₹${data.cost || 0}</strong></td>
                        </tr>
                    </table>

                    <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-left: 4px solid #2196f3;">
                        <strong>📊 Attendance Rate:</strong> ${data.attendanceRate || 0}%
                    </div>

                    ${data.lowStock ? `
                    <div style="margin-top: 15px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107;">
                        <strong>⚠️ Low Stock Alert:</strong><br>
                        Rice Stock: ${data.riceStock} kg (Below threshold)
                    </div>
                    ` : ''}

                    <div style="margin-top: 20px; text-align: center;">
                        <a href="${process.env.FRONTEND_URL}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px;">View Dashboard</a>
                    </div>
                </div>

                <div style="padding: 15px; text-align: center; color: #666; font-size: 12px;">
                    <p>RHS MDM Management System V2.0</p>
                    <p>This is an automated report. Please do not reply to this email.</p>
                </div>
            </div>
        `;

        try {
            await this.transporter.sendMail({
                from: `"RHS MDM System" <${process.env.EMAIL_USER}>`,
                to: data.recipients || process.env.ADMIN_EMAIL,
                subject: `Daily MDM Report - ${data.date}`,
                html: html
            });
            console.log(`✅ Daily report sent for ${data.date}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to send daily report:', error.message);
            return false;
        }
    }

    // Send low stock alert
    async sendLowStockAlert(stockData) {
        if (!this.initialized) return false;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #ff6b6b; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">⚠️ Low Stock Alert</h1>
                    <p style="margin: 5px 0;">Immediate Action Required</p>
                </div>
                
                <div style="padding: 20px; background: #fff3cd;">
                    <h2 style="color: #856404;">Stock Warning</h2>
                    <p>The following item is running low:</p>
                    
                    <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <h3 style="margin: 0 0 10px 0;">${stockData.itemName}</h3>
                        <p style="margin: 5px 0;"><strong>Current Stock:</strong> ${stockData.currentStock} ${stockData.unit}</p>
                        <p style="margin: 5px 0;"><strong>Threshold:</strong> ${stockData.threshold} ${stockData.unit}</p>
                        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #d32f2f;">⚠️ Below Minimum</span></p>
                    </div>

                    <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <strong>📋 Recommendation:</strong><br>
                        Order at least ${stockData.recommendedOrder} ${stockData.unit} to maintain adequate stock levels.
                    </div>

                    <div style="margin-top: 20px; text-align: center;">
                        <a href="${process.env.FRONTEND_URL}/app.html" style="display: inline-block; padding: 12px 30px; background: #ff6b6b; color: white; text-decoration: none; border-radius: 5px;">Update Stock Now</a>
                    </div>
                </div>

                <div style="padding: 15px; text-align: center; color: #666; font-size: 12px;">
                    <p>RHS MDM Management System V2.0</p>
                </div>
            </div>
        `;

        try {
            await this.transporter.sendMail({
                from: `"RHS MDM Alert" <${process.env.EMAIL_USER}>`,
                to: stockData.recipients || process.env.ADMIN_EMAIL,
                subject: `🚨 Low Stock Alert: ${stockData.itemName}`,
                html: html,
                priority: 'high'
            });
            console.log(`✅ Low stock alert sent for ${stockData.itemName}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to send low stock alert:', error.message);
            return false;
        }
    }

    // Send weekly summary
    async sendWeeklySummary(summaryData) {
        if (!this.initialized) return false;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">📊 Weekly MDM Summary</h1>
                    <p style="margin: 5px 0;">Week: ${summaryData.weekStart} to ${summaryData.weekEnd}</p>
                </div>
                
                <div style="padding: 20px; background: #f9f9f9;">
                    <h2>Performance Highlights</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0;">
                        <div style="background: white; padding: 15px; border-radius: 5px; text-align: center;">
                            <div style="font-size: 32px; color: #667eea; font-weight: bold;">${summaryData.totalMeals || 0}</div>
                            <div style="color: #666;">Total Meals</div>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 5px; text-align: center;">
                            <div style="font-size: 32px; color: #667eea; font-weight: bold;">${summaryData.avgAttendance || 0}%</div>
                            <div style="color: #666;">Avg Attendance</div>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 5px; text-align: center;">
                            <div style="font-size: 32px; color: #667eea; font-weight: bold;">₹${summaryData.totalExpense || 0}</div>
                            <div style="color: #666;">Total Expense</div>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 5px; text-align: center;">
                            <div style="font-size: 32px; color: #667eea; font-weight: bold;">${summaryData.workingDays || 0}</div>
                            <div style="color: #666;">Working Days</div>
                        </div>
                    </div>

                    <h3>Daily Breakdown</h3>
                    <table style="width: 100%; border-collapse: collapse; background: white;">
                        <tr style="background: #667eea; color: white;">
                            <th style="padding: 10px; text-align: left;">Date</th>
                            <th style="padding: 10px; text-align: right;">Attendance</th>
                            <th style="padding: 10px; text-align: right;">Meals</th>
                        </tr>
                        ${summaryData.dailyData ? summaryData.dailyData.map(day => `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${day.date}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${day.attendance}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${day.meals}</td>
                        </tr>
                        `).join('') : ''}
                    </table>

                    <div style="margin-top: 20px; text-align: center;">
                        <a href="${process.env.FRONTEND_URL}/dashboard.html" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px;">View Full Dashboard</a>
                    </div>
                </div>

                <div style="padding: 15px; text-align: center; color: #666; font-size: 12px;">
                    <p>RHS MDM Management System V2.0</p>
                </div>
            </div>
        `;

        try {
            await this.transporter.sendMail({
                from: `"RHS MDM System" <${process.env.EMAIL_USER}>`,
                to: summaryData.recipients || process.env.ADMIN_EMAIL,
                subject: `Weekly MDM Summary - ${summaryData.weekStart} to ${summaryData.weekEnd}`,
                html: html
            });
            console.log(`✅ Weekly summary sent`);
            return true;
        } catch (error) {
            console.error('❌ Failed to send weekly summary:', error.message);
            return false;
        }
    }

    // Send password reset email
    async sendPasswordReset(userData) {
        if (!this.initialized) return false;

        const resetLink = `${process.env.FRONTEND_URL}/reset-password.html?token=${userData.resetToken}`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">🔐 Password Reset Request</h1>
                </div>
                
                <div style="padding: 20px; background: #f9f9f9;">
                    <p>Hello ${userData.name},</p>
                    
                    <p>We received a request to reset your password for the RHS MDM System account.</p>

                    <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Account Email:</strong> ${userData.email}</p>
                    </div>

                    <p>Click the button below to reset your password:</p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    </div>

                    <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
                    <p style="background: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">${resetLink}</p>

                    <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <strong>⚠️ Security Notice:</strong><br>
                        This link will expire in 1 hour for security reasons.<br>
                        If you didn't request this reset, please ignore this email.
                    </div>
                </div>

                <div style="padding: 15px; text-align: center; color: #666; font-size: 12px;">
                    <p>RHS MDM Management System V2.0</p>
                </div>
            </div>
        `;

        try {
            await this.transporter.sendMail({
                from: `"RHS MDM System" <${process.env.EMAIL_USER}>`,
                to: userData.email,
                subject: 'Password Reset Request - RHS MDM System',
                html: html
            });
            console.log(`✅ Password reset email sent to ${userData.email}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to send password reset email:', error.message);
            return false;
        }
    }

    // Send generic notification
    async sendNotification(data) {
        if (!this.initialized) return false;

        try {
            await this.transporter.sendMail({
                from: `"RHS MDM System" <${process.env.EMAIL_USER}>`,
                to: data.to,
                subject: data.subject,
                html: data.html || data.text
            });
            console.log(`✅ Notification sent to ${data.to}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to send notification:', error.message);
            return false;
        }
    }
}

// Export singleton instance
const emailSystem = new EmailNotificationSystem();
module.exports = emailSystem;
