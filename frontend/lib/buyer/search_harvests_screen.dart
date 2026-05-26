import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../models/harvest_model.dart';
import '../services/api_service.dart';
import '../shared/chat_screen.dart';

class HarvestDetailScreen extends StatefulWidget {
	final Harvest harvest;

	const HarvestDetailScreen({super.key, required this.harvest});

	@override
	State<HarvestDetailScreen> createState() => _HarvestDetailScreenState();
}

class _HarvestDetailScreenState extends State<HarvestDetailScreen> {
	double _quantity = 0;
	bool _isLoading = false;

	void _startOrder() async {
		if (_quantity <= 0 || _quantity > widget.harvest.quantity) {
			ScaffoldMessenger.of(context).showSnackBar(
				const SnackBar(content: Text('Please enter valid quantity')),
			);
			return;
		}

		setState(() => _isLoading = true);

		try {
			final result = await ApiService().initiateTransaction(
				harvestId: widget.harvest.id,
				quantity: _quantity,
				deliveryLocation: {}, // Get from buyer profile
			);

			if (result['success']) {
				// Open payment URL or show payment dialog
				ScaffoldMessenger.of(context).showSnackBar(
					const SnackBar(content: Text('Order initiated! Complete payment to proceed.')),
				);
			}
		} catch (e) {
			ScaffoldMessenger.of(context).showSnackBar(
				SnackBar(content: Text('Error: $e')),
			);
		} finally {
			setState(() => _isLoading = false);
		}
	}

	void _openChat() {
		Navigator.push(
			context,
			MaterialPageRoute(
				builder: (_) => ChatScreen(
					otherUserId: widget.harvest.farmerId,
					otherUserName: 'Farmer',
				),
			),
		);
	}

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			body: CustomScrollView(
				slivers: [
					// App Bar with Image
					SliverAppBar(
						expandedHeight: 300.h,
						pinned: true,
						flexibleSpace: FlexibleSpaceBar(
							background: widget.harvest.images.isNotEmpty
									? PageView.builder(
											itemCount: widget.harvest.images.length,
											itemBuilder: (context, index) {
												return Image.network(
													widget.harvest.images[index],
													fit: BoxFit.cover,
												);
											},
										)
									: Container(color: Colors.grey[200]),
						),
					),
          
					// Content
					SliverToBoxAdapter(
						child: Padding(
							padding: EdgeInsets.all(16.w),
							child: Column(
								crossAxisAlignment: CrossAxisAlignment.start,
								children: [
									Row(
										mainAxisAlignment: MainAxisAlignment.spaceBetween,
										children: [
											Expanded(
												child: Text(
													widget.harvest.cropType.toUpperCase(),
													style: TextStyle(
														fontSize: 24.sp,
														fontWeight: FontWeight.bold,
													),
												),
											),
											Chip(
												label: Text(widget.harvest.quality),
												backgroundColor: Colors.green[100],
											),
										],
									),
                  
									SizedBox(height: 8.h),
									Row(
										children: [
											Icon(Icons.location_on, size: 20.w, color: Colors.grey),
											SizedBox(width: 8.w),
											Text(
												'${widget.harvest.location['town']}, ${widget.harvest.location['state']}',
												style: TextStyle(color: Colors.grey[600], fontSize: 16.sp),
											),
										],
									),
                  
									SizedBox(height: 24.h),
									Text(
										'₦${widget.harvest.pricePerUnit.toStringAsFixed(0)} / ${widget.harvest.unit}',
										style: TextStyle(
											fontSize: 28.sp,
											fontWeight: FontWeight.bold,
											color: const Color(0xFF2E7D32),
										),
									),
                  
									SizedBox(height: 8.h),
									Text(
										'Total available: ${widget.harvest.quantity} ${widget.harvest.unit}',
										style: TextStyle(color: Colors.grey[600]),
									),
                  
									SizedBox(height: 24.h),
									Text(
										'Description',
										style: TextStyle(
											fontSize: 18.sp,
											fontWeight: FontWeight.w600,
										),
									),
									SizedBox(height: 8.h),
									Text(
										widget.harvest.description ?? 'No description available',
										style: TextStyle(color: Colors.grey[600], height: 1.5),
									),
                  
									SizedBox(height: 24.h),
									Text(
										'Quantity to Buy',
										style: TextStyle(
											fontSize: 18.sp,
											fontWeight: FontWeight.w600,
										),
									),
									SizedBox(height: 16.h),
                  
									// Quantity Selector
									Row(
										children: [
											IconButton(
												onPressed: () {
													if (_quantity > 0) {
														setState(() => _quantity -= widget.harvest.quantity * 0.1);
													}
												},
												icon: const Icon(Icons.remove_circle_outline),
											),
											Expanded(
												child: Slider(
													value: _quantity,
													max: widget.harvest.quantity,
													divisions: 10,
													label: _quantity.toStringAsFixed(1),
													onChanged: (value) => setState(() => _quantity = value),
												),
											),
											IconButton(
												onPressed: () {
													if (_quantity < widget.harvest.quantity) {
														setState(() => _quantity += widget.harvest.quantity * 0.1);
													}
												},
												icon: const Icon(Icons.add_circle_outline),
											),
										],
									),
                  
									Center(
										child: Text(
											'${_quantity.toStringAsFixed(1)} ${widget.harvest.unit}',
											style: TextStyle(
												fontSize: 20.sp,
												fontWeight: FontWeight.bold,
											),
										),
									),
                  
									if (_quantity > 0) ...[
										SizedBox(height: 8.h),
										Center(
											child: Text(
												'Total: ₦${(_quantity * widget.harvest.pricePerUnit).toStringAsFixed(0)}',
												style: TextStyle(
													fontSize: 18.sp,
													color: const Color(0xFF2E7D32),
													fontWeight: FontWeight.w600,
												),
											),
										),
									],
                  
									SizedBox(height: 32.h),
								],
							),
						),
					),
				],
			),
      
			bottomNavigationBar: Padding(
				padding: EdgeInsets.all(16.w),
				child: Row(
					children: [
						Expanded(
							flex: 1,
							child: OutlinedButton.icon(
								onPressed: _openChat,
								icon: const Icon(Icons.chat),
								label: const Text('Chat'),
								style: OutlinedButton.styleFrom(
									padding: EdgeInsets.symmetric(vertical: 16.h),
								),
							),
						),
						SizedBox(width: 16.w),
						Expanded(
							flex: 2,
							child: ElevatedButton(
								onPressed: _quantity > 0 ? _startOrder : null,
								style: ElevatedButton.styleFrom(
									padding: EdgeInsets.symmetric(vertical: 16.h),
								),
								child: _isLoading
										? const CircularProgressIndicator(color: Colors.white)
										: const Text('Buy Now'),
							),
						),
					],
				),
			),
		);
	}
}
