import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';

class LocationService {
	static Future<Position> getCurrentLocation() async {
		bool serviceEnabled;
		LocationPermission permission;

		// Check if location services are enabled
		serviceEnabled = await Geolocator.isLocationServiceEnabled();
		if (!serviceEnabled) {
			throw Exception('Location services are disabled');
		}

		// Check permission
		permission = await Geolocator.checkPermission();
		if (permission == LocationPermission.denied) {
			permission = await Geolocator.requestPermission();
			if (permission == LocationPermission.denied) {
				throw Exception('Location permissions are denied');
			}
		}

		if (permission == LocationPermission.deniedForever) {
			throw Exception('Location permissions are permanently denied');
		}

		return await Geolocator.getCurrentPosition(
			desiredAccuracy: LocationAccuracy.high,
		);
	}

	static Future<String> getAddressFromCoordinates(double lat, double lng) async {
		try {
			List<Placemark> placemarks = await placemarkFromCoordinates(lat, lng);
			if (placemarks.isNotEmpty) {
				Placemark place = placemarks.first;
				return '${place.street}, ${place.locality}, ${place.administrativeArea}';
			}
			return 'Unknown location';
		} catch (e) {
			return 'Error getting address';
		}
	}

	static Future<Map<String, dynamic>?> getPlaceDetails(String address) async {
		try {
			List<Location> locations = await locationFromAddress(address);
			if (locations.isNotEmpty) {
				return {
					'lat': locations.first.latitude,
					'lng': locations.first.longitude,
				};
			}
			return null;
		} catch (e) {
			return null;
		}
	}

	static double calculateDistance(double startLat, double startLng, double endLat, double endLng) {
		return Geolocator.distanceBetween(startLat, startLng, endLat, endLng) / 1000; // km
	}
}
