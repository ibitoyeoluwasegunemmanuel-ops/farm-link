import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
	final String baseUrl = 'YOUR_BACKEND_URL/api';
  
	Future<Map<String, String>> _getHeaders() async {
		final prefs = await SharedPreferences.getInstance();
		final token = prefs.getString('token');
		return {
			'Content-Type': 'application/json',
			if (token != null) 'Authorization': 'Bearer $token',
		};
	}

	// Harvests
	Future<List<dynamic>> searchHarvests({
		String? cropType,
		String? state,
		double? minPrice,
		double? maxPrice,
	}) async {
		try {
			final queryParams = <String, String>{};
			if (cropType != null) queryParams['cropType'] = cropType;
			if (state != null) queryParams['state'] = state;
			if (minPrice != null) queryParams['minPrice'] = minPrice.toString();
			if (maxPrice != null) queryParams['maxPrice'] = maxPrice.toString();

			final uri = Uri.parse('$baseUrl/harvests/search')
					.replace(queryParameters: queryParams);

			final response = await http.get(uri, headers: await _getHeaders());
			final data = jsonDecode(response.body);
      
			return data['data'] ?? [];
		} catch (e) {
			return [];
		}
	}

	Future<Map<String, dynamic>> createHarvest(Map<String, dynamic> harvestData, 
			List<File> images) async {
		try {
			var request = http.MultipartRequest(
				'POST',
				Uri.parse('$baseUrl/harvests/create'),
			);

			request.headers.addAll(await _getHeaders());
      
			// Add text fields
			harvestData.forEach((key, value) {
				request.fields[key] = value.toString();
			});

			// Add images
			for (var image in images) {
				request.files.add(await http.MultipartFile.fromPath(
					'images',
					image.path,
					contentType: MediaType('image', 'jpeg'),
				));
			}

			final response = await request.send();
			final respStr = await response.stream.bytesToString();
			return jsonDecode(respStr);
		} catch (e) {
			return {'success': false, 'error': e.toString()};
		}
	}

	// Transactions
	Future<Map<String, dynamic>> initiateTransaction({
		required String harvestId,
		required double quantity,
		required Map<String, dynamic> deliveryLocation,
	}) async {
		try {
			final prefs = await SharedPreferences.getInstance();
			final buyerId = prefs.getString('userId');

			final response = await http.post(
				Uri.parse('$baseUrl/transactions/initiate'),
				headers: await _getHeaders(),
				body: jsonEncode({
					'buyerId': buyerId,
					'harvestId': harvestId,
					'quantity': quantity,
					'deliveryLocation': deliveryLocation,
				}),
			);

			return jsonDecode(response.body);
		} catch (e) {
			return {'success': false, 'error': e.toString()};
		}
	}

	// Logistics
	Future<List<dynamic>> findTrucks({
		required Map<String, dynamic> pickupLocation,
		required Map<String, dynamic> deliveryLocation,
		required double requiredCapacity,
	}) async {
		try {
			final response = await http.post(
				Uri.parse('$baseUrl/logistics/find-trucks'),
				headers: await _getHeaders(),
				body: jsonEncode({
					'pickupLocation': pickupLocation,
					'deliveryLocation': deliveryLocation,
					'requiredCapacity': requiredCapacity,
				}),
			);

			final data = jsonDecode(response.body);
			return data['trucks'] ?? [];
		} catch (e) {
			return [];
		}
	}
}
