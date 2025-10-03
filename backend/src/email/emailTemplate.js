export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to iBRO</title>
  </head>
  <body style="font-family: 'Urbanist', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #e8e8e8; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #854d0e 75%, #a16207 100%); min-height: 100vh; position: relative;">
    
    <!-- Floating spheres background effect -->
    <div style="position: absolute; top: -50px; left: -50px; width: 150px; height: 150px; background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.05) 70%, transparent 100%); border-radius: 50%; pointer-events: none;"></div>
    <div style="position: absolute; top: 100px; right: -30px; width: 100px; height: 100px; background: radial-gradient(circle, rgba(234,179,8,0.15) 0%, rgba(234,179,8,0.03) 70%, transparent 100%); border-radius: 50%; pointer-events: none;"></div>
    <div style="position: absolute; bottom: 50px; left: 30px; width: 80px; height: 80px; background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.02) 70%, transparent 100%); border-radius: 50%; pointer-events: none;"></div>
    <div style="position: absolute; bottom: -40px; right: 100px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(234,179,8,0.1) 0%, rgba(234,179,8,0.02) 70%, transparent 100%); border-radius: 50%; pointer-events: none;"></div>
    
    <div style="position: relative; z-index: 1;">
      <!-- Glass morphism header -->
      <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); padding: 40px; text-align: center; border-radius: 20px 20px 0 0; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #eab308 100%); width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255, 255, 255, 0.3); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);">
          <span style="font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 900; color: #ffffff; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);">iB</span>
        </div>
        <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); font-family: 'Outfit', sans-serif;">Welcome to iBRO</h1>
        <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Your Personal Accountability Partner</p>
      </div>
      
      <!-- Glass morphism main content -->
      <div style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.15); border-top: none; padding: 40px; border-radius: 0 0 20px 20px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
        <p style="font-size: 18px; color: #ffffff; font-weight: 500;"><strong>Hello ${name},</strong></p>
        <p style="color: #d0d0d0; font-weight: 300;">We're thrilled to have you join iBRO! Your journey to better productivity and accountability starts now. Track your work sessions, take strategic breaks, and achieve your goals with real-time insights.</p>
        
        <!-- Glass morphism feature box -->
        <div style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.15); padding: 30px; border-radius: 16px; margin: 30px 0; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.2);">
          <p style="font-size: 16px; margin: 0 0 20px 0; color: #ffffff; font-weight: 500;"><strong>Get started with iBRO:</strong></p>
          <ul style="padding-left: 20px; margin: 0; color: #d0d0d0; font-weight: 300;">
            <li style="margin-bottom: 12px; position: relative;">
              <span style="position: absolute; left: -15px; color: #eab308;">•</span>
              Clock in to start tracking your work session
            </li>
            <li style="margin-bottom: 12px; position: relative;">
              <span style="position: absolute; left: -15px; color: #3b82f6;">•</span>
              Set target hours to stay on track
            </li>
            <li style="margin-bottom: 12px; position: relative;">
              <span style="position: absolute; left: -15px; color: #eab308;">•</span>
              Take breaks and resume when ready
            </li>
            <li style="margin-bottom: 0; position: relative;">
              <span style="position: absolute; left: -15px; color: #3b82f6;">•</span>
              Review your session history and progress
            </li>
          </ul>
        </div>
        
        <!-- Glass morphism button -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="${clientURL}" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border: 1px solid rgba(255, 255, 255, 0.3); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 50px; font-weight: 500; display: inline-block; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); letter-spacing: 0.5px;">Start Tracking Now</a>
        </div>
        
        <p style="margin-bottom: 5px; color: #d0d0d0; font-weight: 300;">Stay accountable, stay productive, and achieve your goals one session at a time.</p>
        <p style="margin-top: 0; color: #d0d0d0; font-weight: 300;">Let's make every hour count!</p>
        
        <p style="margin-top: 30px; margin-bottom: 0; color: #d0d0d0; font-weight: 300;">Best regards,<br><span style="color: #ffffff; font-weight: 500;">The iBRO Team</span></p>
      </div>
      
      <!-- Glass morphism footer -->
      <div style="text-align: center; padding: 25px; color: rgba(255, 255, 255, 0.5); font-size: 12px; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; margin-top: 20px; font-weight: 300;">
        <p>© 2025 iBRO. All rights reserved.</p>
        <p>
          <a href="#" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; margin: 0 15px; transition: color 0.3s ease;">Privacy Policy</a>
          <a href="#" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; margin: 0 15px; transition: color 0.3s ease;">Terms of Service</a>
          <a href="#" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; margin: 0 15px; transition: color 0.3s ease;">Contact Us</a>
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
}