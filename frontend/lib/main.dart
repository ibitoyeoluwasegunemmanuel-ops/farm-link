import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'splash_screen.dart';
import 'auth/login_screen.dart';
import 'auth/role_selection_screen.dart';
import 'farmer/farmer_dashboard.dart';
import 'buyer/buyer_dashboard.dart';
import 'transporter/transporter_dashboard.dart';
import 'services/auth_service.dart';

void main() async {
	WidgetsFlutterBinding.ensureInitialized();
	await Firebase.initializeApp();
	await dotenv.load(fileName: ".env");
  
	runApp(const FarmLinkApp());
}

class FarmLinkApp extends StatelessWidget {
	const FarmLinkApp({super.key});

	@override
	Widget build(BuildContext context) {
		return ScreenUtilInit(
			designSize: const Size(375, 812),
			minTextAdapt: true,
			splitScreenMode: true,
			builder: (context, child) {
				return MaterialApp(
					title: 'FarmLink',
					debugShowCheckedModeBanner: false,
					theme: ThemeData(
						primarySwatch: Colors.green,
						primaryColor: const Color(0xFF2E7D32),
						scaffoldBackgroundColor: Colors.white,
						textTheme: GoogleFonts.poppinsTextTheme(),
						elevatedButtonTheme: ElevatedButtonThemeData(
							style: ElevatedButton.styleFrom(
								backgroundColor: const Color(0xFF2E7D32),
								foregroundColor: Colors.white,
								padding: EdgeInsets.symmetric(vertical: 16.h),
								shape: RoundedRectangleBorder(
									borderRadius: BorderRadius.circular(12.r),
								),
							),
						),
					),
					initialRoute: '/',
					routes: {
						'/': (context) => const SplashScreen(),
						'/login': (context) => const LoginScreen(),
						'/role-selection': (context) => const RoleSelectionScreen(),
						'/farmer-dashboard': (context) => const FarmerDashboard(),
						'/buyer-dashboard': (context) => const BuyerDashboard(),
						'/transporter-dashboard': (context) => const TransporterDashboard(),
					},
				);
			},
		);
	}
}
