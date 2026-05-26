import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AuthService {
	final String baseUrl = 'YOUR_BACKEND_URL'; // e.g., http://localhost:3000/api
	final FirebaseAuth _auth = FirebaseAuth.instance;

	Future<Map<String, dynamic>> sendOTP(String phoneNumber) async {
		try {
			final response = await http.post(
				Uri.parse('$baseUrl/auth/send-otp'),
				headers: {'Content-Type': 'application/json'},
				body: jsonEncode({'phoneNumber': phoneNumber}),
			);

			return jsonDecode(response.body);
		} catch (e) {
			return {'success': false, 'message': e.toString()};
		}
	}

	Future<Map<String, dynamic>> verifyOTP(String phoneNumber, String otp) async {
		try {
			final response = await http.post(
				Uri.parse('$baseUrl/auth/verify-otp'),
				headers: {'Content-Type': 'application/json'},
				body: jsonEncode({
					'phoneNumber': phoneNumber,
					'otp': otp,
				}),
			);

			final data = jsonDecode(response.body);
      
			if (data['success']) {
				// Save auth data locally
				final prefs = await SharedPreferences.getInstance();
				await prefs.setString('token', data['token']);
				await prefs.setString('userId', data['userId']);
				await prefs.setString('role', data['role']);
        
				// Sign in to Firebase
				await _auth.signInWithCustomToken(data['token']);
			}

			return data;
		} catch (e) {
			return {'success': false, 'message': e.toString()};
		}
	}

	Future<Map<String, dynamic>> setUserRole(String role) async {
		try {
			final prefs = await SharedPreferences.getInstance();
			final userId = prefs.getString('userId');
      
			// Update user role in backend
			final response = await http.post(
				Uri.parse('$baseUrl/auth/set-role'),
				headers: {'Content-Type': 'application/json'},
				body: jsonEncode({
					'userId': userId,
					'role': role,
				}),
			);

			final data = jsonDecode(response.body);
      
			if (data['success']) {
				await prefs.setString('role', role);
			}

			return data;
		} catch (e) {
			return {'success': false, 'message': e.toString()};
		}
	}

	Future<bool> isLoggedIn() async {
		final prefs = await SharedPreferences.getInstance();
		final token = prefs.getString('token');
		return token != null && _auth.currentUser != null;
	}

	Future<String?> getUserRole() async {
		final prefs = await SharedPreferences.getInstance();
		return prefs.getString('role');
	}

	Future<void> logout() async {
		final prefs = await SharedPreferences.getInstance();
		await prefs.clear();
		await _auth.signOut();
	}
}
