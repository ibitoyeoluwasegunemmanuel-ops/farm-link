import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:image_picker/image_picker.dart';
import '../services/api_service.dart';
import '../services/location_service.dart';

class PostHarvestScreen extends StatefulWidget {
	const PostHarvestScreen({super.key});

	@override
	State<PostHarvestScreen> createState() => _PostHarvestScreenState();
}

class _PostHarvestScreenState extends State<PostHarvestScreen> {
	final _formKey = GlobalKey<FormState>();
	final _cropTypeController = TextEditingController();
	final _quantityController = TextEditingController();
	final _priceController = TextEditingController();
	final _descriptionController = TextEditingController();
  
	String _selectedUnit = 'kg';
	String _selectedQuality = 'Grade A';
	List<File> _images = [];
	bool _isLoading = false;
	Map<String, dynamic>? _currentLocation;

	final List<String> _units = ['kg', 'tonnes', 'bags', 'crates', 'baskets'];
	final List<String> _qualities = ['Grade A', 'Grade B', 'Grade C', 'Premium', 'Standard'];

	Future<void> _pickImages() async {
		final picker = ImagePicker();
		final pickedFiles = await picker.pickMultiImage();
    
		if (pickedFiles != null) {
			setState(() {
				_images = pickedFiles.map((file) => File(file.path)).toList();
			});
		}
	}

	Future<void> _getLocation() async {
		try {
			final position = await LocationService.getCurrentLocation();
			final address = await LocationService.getAddressFromCoordinates(
				position.latitude,
				position.longitude,
			);
      
			setState(() {
				_currentLocation = {
					'coordinates': {
						'lat': position.latitude,
						'lng': position.longitude,
					},
					'address': address,
				};
			});
		} catch (e) {
			ScaffoldMessenger.of(context).showSnackBar(
				SnackBar(content: Text('Error getting location: $e')),
			);
		}
	}

	void _submit() async {
		if (!_formKey.currentState!.validate()) return;
		if (_images.isEmpty) {
			ScaffoldMessenger.of(context).showSnackBar(
				const SnackBar(content: Text('Please add at least one image')),
			);
			return;
		}
		if (_currentLocation == null) {
			ScaffoldMessenger.of(context).showSnackBar(
				const SnackBar(content: Text('Please enable location')),
			);
			return;
		}

		setState(() => _isLoading = true);

		try {
			final harvestData = {
				'cropType': _cropTypeController.text.toLowerCase(),
				'quantity': _quantityController.text,
				'unit': _selectedUnit,
				'pricePerUnit': _priceController.text,
				'quality': _selectedQuality,
				'description': _descriptionController.text,
				'harvestDate': DateTime.now().toIso8601String(),
				'location': _currentLocation,
			};

			final result = await ApiService().createHarvest(harvestData, _images);

			if (result['success']) {
				ScaffoldMessenger.of(context).showSnackBar(
					const SnackBar(content: Text('Harvest posted successfully!')),
				);
				Navigator.pop(context);
			} else {
				throw Exception(result['error']);
			}
		} catch (e) {
			ScaffoldMessenger.of(context).showSnackBar(
				SnackBar(content: Text('Error: $e')),
			);
		} finally {
			setState(() => _isLoading = false);
		}
	}

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			appBar: AppBar(
				title: const Text('Post New Harvest'),
				backgroundColor: const Color(0xFF2E7D32),
			),
			body: SingleChildScrollView(
				padding: EdgeInsets.all(16.w),
				child: Form(
					key: _formKey,
					child: Column(
						crossAxisAlignment: CrossAxisAlignment.start,
						children: [
							// Images
							Text('Product Images', style: TextStyle(fontWeight: FontWeight.w600)),
							SizedBox(height: 8.h),
							GestureDetector(
								onTap: _pickImages,
								child: Container(
									height: 120.h,
									decoration: BoxDecoration(
										color: Colors.grey[100],
										borderRadius: BorderRadius.circular(12.r),
										border: Border.all(color: Colors.grey[300]!),
									),
									child: _images.isEmpty
											? Center(
													child: Column(
														mainAxisAlignment: MainAxisAlignment.center,
														children: [
															Icon(Icons.camera_alt, size: 40.w, color: Colors.grey),
															Text('Tap to add images', style: TextStyle(color: Colors.grey)),
														],
													),
												)
											: ListView.builder(
													scrollDirection: Axis.horizontal,
													itemCount: _images.length,
													itemBuilder: (context, index) {
														return Padding(
															padding: EdgeInsets.all(8.w),
															child: ClipRRect(
																borderRadius: BorderRadius.circular(8.r),
																child: Image.file(
																	_images[index],
																	width: 100.w,
																	height: 100.h,
																	fit: BoxFit.cover,
																),
															),
														);
													},
												),
								),
							),
							SizedBox(height: 20.h),

							// Crop Type
							TextFormField(
								controller: _cropTypeController,
								decoration: InputDecoration(
									labelText: 'Crop Type',
									hintText: 'e.g., Palm Oil, Cassava, Maize',
									border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.r)),
								),
								validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
							),
							SizedBox(height: 16.h),

							// Quantity and Unit
							Row(
								children: [
									Expanded(
										flex: 2,
										child: TextFormField(
											controller: _quantityController,
											keyboardType: TextInputType.number,
											decoration: InputDecoration(
												labelText: 'Quantity',
												border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.r)),
											),
											validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
										),
									),
									SizedBox(width: 12.w),
									Expanded(
										flex: 1,
										child: DropdownButtonFormField<String>(
											value: _selectedUnit,
											decoration: InputDecoration(
												labelText: 'Unit',
												border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.r)),
											),
											items: _units.map((unit) {
												return DropdownMenuItem(value: unit, child: Text(unit));
											}).toList(),
											onChanged: (value) => setState(() => _selectedUnit = value!),
										),
									),
								],
							),
							SizedBox(height: 16.h),

							// Price
							TextFormField(
								controller: _priceController,
								keyboardType: TextInputType.number,
								decoration: InputDecoration(
									labelText: 'Price per $_selectedUnit (₦)',
									prefixText: '₦ ',
									border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.r)),
								),
								validator: (value) => value?.isEmpty ?? true ? 'Required' : null,
							),
							SizedBox(height: 16.h),

							// Quality
							DropdownButtonFormField<String>(
								value: _selectedQuality,
								decoration: InputDecoration(
									labelText: 'Quality Grade',
									border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.r)),
								),
								items: _qualities.map((quality) {
									return DropdownMenuItem(value: quality, child: Text(quality));
								}).toList(),
								onChanged: (value) => setState(() => _selectedQuality = value!),
							),
							SizedBox(height: 16.h),

							// Description
							TextFormField(
								controller: _descriptionController,
								maxLines: 3,
								decoration: InputDecoration(
									labelText: 'Description',
									hintText: 'Describe your produce...',
									border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.r)),
								),
							),
							SizedBox(height: 16.h),

							// Location
							ListTile(
								onTap: _getLocation,
								leading: const Icon(Icons.location_on, color: Color(0xFF2E7D32)),
								title: Text(_currentLocation?['address'] ?? 'Tap
