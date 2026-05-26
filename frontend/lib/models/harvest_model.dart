class Harvest {
  final String id;
  final String farmerId;
  final String cropType;
  final double quantity;
  final String unit;
  final double pricePerUnit;
  final double totalPrice;
  final String quality;
  final String? description;
  final DateTime? harvestDate;
  final Map<String, dynamic> location;
  final List<String> images;
  final String status;
  final int views;
  final int inquiries;
  final DateTime createdAt;

  Harvest({
    required this.id,
    required this.farmerId,
    required this.cropType,
    required this.quantity,
    required this.unit,
    required this.pricePerUnit,
    required this.totalPrice,
    required this.quality,
    this.description,
    this.harvestDate,
    required this.location,
    this.images = const [],
    this.status = 'available',
    this.views = 0,
    this.inquiries = 0,
    required this.createdAt,
  });

  factory Harvest.fromJson(Map<String, dynamic> json) {
    return Harvest(
      id: json['id'],
      farmerId: json['farmerId'],
      cropType: json['cropType'],
      quantity: (json['quantity'] ?? 0).toDouble(),
      unit: json['unit'] ?? 'kg',
      pricePerUnit: (json['pricePerUnit'] ?? 0).toDouble(),
      totalPrice: (json['totalPrice'] ?? 0).toDouble(),
      quality: json['quality'] ?? 'Standard',
      description: json['description'],
      harvestDate: json['harvestDate'] != null 
          ? DateTime.parse(json['harvestDate']) 
          : null,
      location: json['location'] ?? {},
      images: List<String>.from(json['images'] ?? []),
      status: json['status'] ?? 'available',
      views: json['views'] ?? 0,
      inquiries: json['inquiries'] ?? 0,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}
